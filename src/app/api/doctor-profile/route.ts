import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";

// Validation schema for the profile data
const profileSchema = z.object({
  personalInfo: z.object({
    phone: z.string().min(4),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string(),
    bio: z.string().max(500),
    profileImage: z.any().optional(),
  }),
  professionalInfo: z.object({
    specialization: z.string(),
    licenseNumber: z.string(),
    experience: z.number(),
    qualifications: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.number(),
      })
    ),
    languages: z.array(z.string()),
  }),
  practiceDetails: z.object({
    practiceName: z.string(),
    address: z.object({
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      location: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    }),
    consultationFee: z.number(),
    availableHours: z
      .array(
        z.object({
          day: z.string(),
          slots: z.array(
            z.object({
              start: z.string(),
              end: z.string(),
            })
          ),
        })
      )
      .optional(),
  }),
  verificationDocuments: z.object({
    identityProof: z.any(),
    medicalLicense: z.any(),
    additionalDocuments: z.array(z.any()).optional(),
    termsAgreed: z.boolean(),
  }),
});

export async function POST(request: Request) {
  console.log("=== Starting doctor profile creation process ===");

  try {
    // Create Supabase client with error handling
    let supabase: SupabaseClient;
    try {
      console.log("Attempting to create Supabase client...");
      supabase = await createClient();
      console.log("Supabase client created successfully");
    } catch (error) {
      console.error("Error creating Supabase client:", error);
      return NextResponse.json(
        {
          error: "Failed to initialize database connection",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError?.message);
      return NextResponse.json(
        { error: "Unauthorized", details: userError?.message },
        { status: 401 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") as string);

    // Get files from FormData
    const identityProof = formData.get("identityProof") as File;
    const medicalLicense = formData.get("medicalLicense") as File;
    const additionalDocuments: File[] = [];

    // Get all additional documents
    for (let i = 0; formData.get(`additionalDocument${i}`); i++) {
      additionalDocuments.push(formData.get(`additionalDocument${i}`) as File);
    }

    // Validate the data structure
    let validatedData;
    try {
      console.log("Starting data validation...");
      validatedData = profileSchema.parse({
        ...data,
        verificationDocuments: {
          ...data.verificationDocuments,
          identityProof,
          medicalLicense,
          additionalDocuments,
        },
      });
      console.log(
        "Data validation successful. Validated data:",
        JSON.stringify(validatedData, null, 2)
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Validation errors:",
          JSON.stringify(error.errors, null, 2)
        );
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Helper function to upload a file to Supabase storage
    async function uploadFile(file: File, path: string): Promise<string> {
      if (!file || !(file instanceof File)) {
        console.error(`Invalid file provided for ${path}:`, file);
        throw new Error(`Invalid file provided for ${path}`);
      }

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const uniqueId = crypto.randomUUID();
      const fileExtension = file.name.split(".").pop();
      const filename = `${timestamp}-${uniqueId}.${fileExtension}`;
      const fullPath = `${path}/${filename}`;

      console.log(`Uploading file to ${fullPath}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase storage
        const { error } = await supabase.storage
          .from("documents")
          .upload(fullPath, buffer, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error(`Error uploading file to ${fullPath}:`, error);
          throw new Error(`Failed to upload file: ${error.message}`);
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(fullPath);

        console.log(`File uploaded successfully to ${fullPath}`);
        return urlData.publicUrl;
      } catch (error) {
        console.error(`Error in uploadFile for ${path}:`, error);
        throw new Error(
          `Failed to upload file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Upload identity proof
    let identityProofUrl;
    try {
      console.log("Uploading identity proof...");
      identityProofUrl = await uploadFile(identityProof, "identity_proof");
      console.log("Identity proof uploaded successfully:", identityProofUrl);
    } catch (error) {
      console.error("Error uploading identity proof:", error);
      return NextResponse.json(
        { error: "Failed to upload identity proof" },
        { status: 500 }
      );
    }

    // Upload medical license
    let medicalLicenseUrl;
    try {
      console.log("Uploading medical license...");
      medicalLicenseUrl = await uploadFile(medicalLicense, "Medical_License");
      console.log("Medical license uploaded successfully:", medicalLicenseUrl);
    } catch (error) {
      console.error("Error uploading medical license:", error);
      return NextResponse.json(
        { error: "Failed to upload medical license" },
        { status: 500 }
      );
    }

    // Upload additional documents if any
    const additionalDocumentUrls = [];
    for (const doc of additionalDocuments) {
      try {
        const url = await uploadFile(doc, "additional_documents");
        additionalDocumentUrls.push(url);
        console.log("Additional document uploaded successfully:", url);
      } catch (error) {
        console.error("Error uploading additional document:", error);
        // Continue with other uploads even if one fails
      }
    }

    // Update user profile in database
    console.log("Updating user profile in database...");
    console.log("Data to insert:", {
      user_id: user.id,
      phone: validatedData.personalInfo?.phone,
      gender: validatedData.personalInfo?.gender,
      date_of_birth: validatedData.personalInfo?.dateOfBirth,
      // Log other fields for debugging
    });

    try {
      // First check if the profiles table exists
      const { error: tableError } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (tableError) {
        console.error("Error checking profiles table:", tableError);
        return NextResponse.json(
          {
            error: "Database table error",
            details: tableError.message,
            code: tableError.code,
          },
          { status: 500 }
        );
      }

      console.log("Table check successful, proceeding with data insertion");

      // Clean the address object to ensure it's valid JSON
      const cleanAddress = validatedData.practiceDetails?.address
        ? JSON.parse(JSON.stringify(validatedData.practiceDetails.address))
        : null;

      // Clean arrays to ensure they're valid JSON
      const cleanQualifications = validatedData.professionalInfo?.qualifications
        ? JSON.parse(
            JSON.stringify(validatedData.professionalInfo.qualifications)
          )
        : [];

      const cleanLanguages = validatedData.professionalInfo?.languages
        ? JSON.parse(JSON.stringify(validatedData.professionalInfo.languages))
        : [];

      // Prepare profile data according to the actual database schema
      const profileData = {
        id: user.id, // Using id instead of user_id
        full_name: user.user_metadata?.full_name || "",
        phone_number: validatedData.personalInfo?.phone, // phone_number instead of phone
        gender: validatedData.personalInfo?.gender,
        date_of_birth: validatedData.personalInfo?.dateOfBirth,
        bio: validatedData.personalInfo?.bio,
        specialization: validatedData.professionalInfo?.specialization,
        license_number: validatedData.professionalInfo?.licenseNumber,
        years_of_experience: validatedData.professionalInfo?.experience, // years_of_experience instead of experience
        address: JSON.stringify(cleanAddress), // Converting to string since address field is text
        profile_picture: validatedData.personalInfo?.profileImage
          ? "uploaded"
          : null, // profile_picture instead of profileImage
        identity_proof: identityProofUrl,
        medical_license: medicalLicenseUrl,
        additional_documents: JSON.stringify(additionalDocumentUrls), // Converting array to string
        lat: validatedData.practiceDetails?.address?.location?.lat,
        long: validatedData.practiceDetails?.address?.location?.lng, // long instead of lng
      };

      console.log("Inserting profile data:", profileData);

      // Update the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return NextResponse.json(
          {
            error: "Failed to update profile",
            details: profileError.message,
            code: profileError.code,
          },
          { status: 500 }
        );
      }

      // Now handle qualifications separately
      if (cleanQualifications.length > 0) {
        // First, prepare the qualifications data
        const qualificationsData = cleanQualifications.map(
          (qual: { degree: string; institution: string; year: number }) => ({
            profile_id: user.id,
            Degree: qual.degree,
            Institution: qual.institution,
            Year: qual.year,
          })
        );

        console.log("Inserting qualifications:", qualificationsData);

        // Insert qualifications
        const { error: qualError } = await supabase
          .from("qualifications")
          .upsert(qualificationsData);

        if (qualError) {
          console.error("Error inserting qualifications:", qualError);
          // Continue anyway, don't fail the whole operation
        }
      }

      // Handle languages separately
      if (cleanLanguages.length > 0) {
        // Prepare the languages data
        const languagesData = cleanLanguages.map((lang: string) => ({
          profile_id: user.id,
          language: lang,
        }));

        console.log("Inserting languages:", languagesData);

        // Insert languages
        const { error: langError } = await supabase
          .from("languages")
          .upsert(languagesData);

        if (langError) {
          console.error("Error inserting languages:", langError);
          // Continue anyway, don't fail the whole operation
        }
      }
    } catch (dbError) {
      console.error("Exception during database operation:", dbError);
      return NextResponse.json(
        {
          error: "Database operation failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      );
    }

    console.log("Profile updated successfully");
    return NextResponse.json({
      message: "Profile updated successfully",
      files: {
        identityProof: identityProofUrl,
        medicalLicense: medicalLicenseUrl,
        additionalDocuments: additionalDocumentUrls,
      },
    });
  } catch (error) {
    console.error("Error in doctor profile update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
