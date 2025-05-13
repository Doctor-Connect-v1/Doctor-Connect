import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  phone: z
    .string()
    .min(4, "Phone number must be at least 4 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  profileImage: z.any().optional(),
});

// Professional Information Schema
export const professionalInfoSchema = z.object({
  specialization: z.string().min(2, "Specialization is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
  qualifications: z
    .array(
      z.object({
        degree: z.string().min(2, "Degree is required"),
        institution: z.string().min(2, "Institution is required"),
        year: z.number().min(1950, "Year must be after 1950"),
      })
    )
    .min(1, "At least one qualification is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

// Practice Details Schema
export const practiceDetailsSchema = z.object({
  practiceName: z.string().min(2, "Practice name is required"),
  address: z.object({
    streetAddress: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  consultationFee: z
    .number()
    .min(0, "Consultation fee must be a positive number"),
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
});

// Verification Documents Schema
export const verificationSchema = z.object({
  identityProof: z
    .instanceof(File, {
      message: "Identity proof document is required",
    })
    .refine(
      (file) => {
        if (!file) return false;
        const validTypes = ["application/pdf", "image/jpeg", "image/png"];
        return validTypes.includes(file.type);
      },
      {
        message: "File must be PDF, JPG, or PNG",
      }
    ),
  medicalLicense: z
    .instanceof(File, {
      message: "Medical license document is required",
    })
    .refine(
      (file) => {
        if (!file) return false;
        const validTypes = ["application/pdf", "image/jpeg", "image/png"];
        return validTypes.includes(file.type);
      },
      {
        message: "File must be PDF, JPG, or PNG",
      }
    ),
  additionalDocuments: z.array(z.instanceof(File)).optional(),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Combined Form Schema
export const doctorFormSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalInfo: professionalInfoSchema,
  practiceDetails: practiceDetailsSchema,
  verificationDocuments: verificationSchema,
});

// Form Data Types
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type PracticeDetailsFormData = z.infer<typeof practiceDetailsSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type DoctorFormData = z.infer<typeof doctorFormSchema>;

// Form Step Interface
export interface FormStep {
  title: string;
  description: string;
  schema: z.ZodObject<z.ZodRawShape>;
  Component: React.ComponentType<Record<string, unknown>>;
}

// List of form steps with titles and descriptions
export const STEPS = [
  {
    title: "Personal Information",
    description: "Basic details about you",
  },
  {
    title: "Professional Information",
    description: "Your medical qualifications",
  },
  {
    title: "Practice Details",
    description: "Where you practice medicine",
  },
  {
    title: "Verification",
    description: "Upload verification documents",
  },
];
