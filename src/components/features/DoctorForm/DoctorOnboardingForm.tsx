"use client";

import React, { useState, useEffect } from "react";
import { DoctorFormData } from "@/lib/schemas/doctorFormSchema";
import StepNavigation from "./StepNavigation";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ProfessionalInfoStep from "./steps/ProfessionalInfoStep";
import PracticeDetailsStep from "./steps/PracticeDetailsStep";
import VerificationDocumentsStep from "./steps/VerificationDocumentsStep";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormStep,
  personalInfoSchema,
  professionalInfoSchema,
  practiceDetailsSchema,
  verificationSchema,
  doctorFormSchema,
} from "@/lib/schemas/doctorFormSchema";

// Animation variants
const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Form steps
const formSteps: FormStep[] = [
  {
    title: "Personal Information",
    description: "Tell us about yourself",
    schema: personalInfoSchema,
    Component: PersonalInfoStep,
  },
  {
    title: "Professional Information",
    description: "Your qualifications and specialties",
    schema: professionalInfoSchema,
    Component: ProfessionalInfoStep,
  },
  {
    title: "Practice Details",
    description: "Where you practice medicine",
    schema: practiceDetailsSchema,
    Component: PracticeDetailsStep,
  },
  {
    title: "Verification Documents",
    description: "Upload your credentials for verification",
    schema: verificationSchema,
    Component: VerificationDocumentsStep,
  },
];

const DoctorOnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<DoctorFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Get current step
  const currentFormStep = formSteps[currentStep];

  // Setup form with validation for current step
  const methods = useForm({
    resolver: zodResolver(
      currentStep === formSteps.length - 1
        ? doctorFormSchema // Use the complete schema for the last step
        : currentFormStep.schema
    ),
    defaultValues: formData,
    mode: "onChange",
  });

  // Update form values when step changes
  useEffect(() => {
    methods.reset(formData);
  }, [currentStep, formData, methods]);

  // Watch for form values to enable/disable submit button
  const formValues = methods.watch();
  const isFormValid = methods.formState.isValid;
  const hasRequiredFiles = Boolean(
    formValues.verificationDocuments?.identityProof instanceof File &&
      formValues.verificationDocuments?.medicalLicense instanceof File &&
      formValues.verificationDocuments?.termsAgreed
  );

  // Debug form state
  useEffect(() => {
    const verificationDocs = formValues.verificationDocuments || {};
    console.log("Form state:", {
      isValid: methods.formState.isValid,
      errors: methods.formState.errors,
      currentStep,
      totalSteps: formSteps.length,
      isLastStep: currentStep === formSteps.length - 1,
      schema:
        currentStep === formSteps.length - 1
          ? "doctorFormSchema"
          : currentFormStep.schema.description,
      values: methods.getValues(),
      hasRequiredFiles,
      identityProof:
        verificationDocs.identityProof instanceof File
          ? {
              name: verificationDocs.identityProof.name,
              size: verificationDocs.identityProof.size,
              type: verificationDocs.identityProof.type,
            }
          : null,
      medicalLicense:
        verificationDocs.medicalLicense instanceof File
          ? {
              name: verificationDocs.medicalLicense.name,
              size: verificationDocs.medicalLicense.size,
              type: verificationDocs.medicalLicense.type,
            }
          : null,
      termsAgreed: verificationDocs.termsAgreed,
    });
  }, [
    methods.formState,
    formValues,
    hasRequiredFiles,
    currentStep,
    formSteps.length,
    currentFormStep.schema,
  ]);

  // Handle next button click
  const handleNext = async () => {
    // For the last step, use a different validation approach
    if (currentStep === formSteps.length - 1) {
      // Directly validate required files for the last step
      if (hasRequiredFiles) {
        handleSubmit();
        return;
      } else {
        console.log("Required files missing for submission");
        toast({
          title: "Missing Required Documents",
          description:
            "Please ensure all required documents are uploaded and terms are accepted",
          variant: "destructive",
        });
        return;
      }
    }

    // For other steps, validate against the current step's schema
    const isValid = await methods.trigger();
    console.log("Form validation result:", {
      isValid,
      errors: methods.formState.errors,
      values: methods.getValues(),
    });

    if (!isValid) {
      console.log("Form errors:", methods.formState.errors);
      return;
    }

    const values = methods.getValues();
    setFormData((prev) => ({ ...prev, ...values }));

    if (currentStep < formSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      // Smooth scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      // Smooth scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get all form data
      let formValues = methods.getValues();
      console.log("Form values before submission:", formValues);

      // Ensure verificationDocuments exists
      if (!formValues.verificationDocuments) {
        formValues.verificationDocuments = {
          termsAgreed: true,
          identityProof: formValues.identityProof,
          medicalLicense: formValues.medicalLicense,
          additionalDocuments: formValues.additionalDocuments || [],
        };
      }

      // Restructure data to ensure proper nesting
      console.log("Terms agreed value:", {
        fromVerificationDocuments:
          formValues.verificationDocuments?.termsAgreed,
        fromRoot: formValues.termsAgreed,
      });

      const structuredData = {
        personalInfo: {
          phone: formValues.phone,
          gender: formValues.gender,
          dateOfBirth: formValues.dateOfBirth,
          bio: formValues.bio,
          profileImage: formValues.profileImage,
        },
        professionalInfo: {
          specialization: formValues.specialization,
          licenseNumber: formValues.licenseNumber,
          experience: formValues.experience,
          qualifications: formValues.qualifications,
          languages: formValues.languages,
        },
        practiceDetails: {
          practiceName: formValues.practiceName,
          address: {
            streetAddress: formValues.address?.streetAddress,
            city: formValues.address?.city,
            state: formValues.address?.state,
            postalCode: formValues.address?.postalCode,
            country: formValues.address?.country,
            location: formValues.address?.location ||
              formValues.practiceDetails?.address?.location || {
                lat: 36.8065,
                lng: 10.1815,
              },
          },
          consultationFee: formValues.consultationFee,
          availableHours: formValues.availableHours,
        },
        verificationDocuments: {
          termsAgreed:
            formValues.verificationDocuments?.termsAgreed === true ||
            formValues.termsAgreed === true,
          identityProof: formValues.verificationDocuments?.identityProof,
          medicalLicense: formValues.verificationDocuments?.medicalLicense,
          additionalDocuments:
            formValues.verificationDocuments?.additionalDocuments,
        },
      };

      console.log("Structured data:", structuredData);

      // Use the structured data for validation
      formValues = structuredData;

      // Validate required files
      if (!(formValues.verificationDocuments?.identityProof instanceof File)) {
        console.log("Identity proof validation failed");
        toast({
          title: "Identity Proof Required",
          description:
            "Please upload your identity proof document (PDF, JPG, or PNG)",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!(formValues.verificationDocuments?.medicalLicense instanceof File)) {
        console.log("Medical license validation failed");
        toast({
          title: "Medical License Required",
          description:
            "Please upload your medical license document (PDF, JPG, or PNG)",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if we have location coordinates
      if (
        !formValues.practiceDetails?.address?.location?.lat ||
        !formValues.practiceDetails?.address?.location?.lng
      ) {
        console.log("No location coordinates found, attempting geocoding...");

        // Geocode the address to get coordinates
        try {
          // Get address components
          const streetAddress =
            formValues.practiceDetails.address.streetAddress;
          const city = formValues.practiceDetails.address.city;
          const state = formValues.practiceDetails.address.state;
          const postalCode = formValues.practiceDetails.address.postalCode;
          const country = formValues.practiceDetails.address.country;

          // Need at least city to geocode
          if (!city) {
            console.log("Cannot geocode without city");
            toast({
              title: "City Required",
              description: "Please provide a city for your practice location.",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }

          // Build search query
          const parts = [];
          if (streetAddress) parts.push(streetAddress);
          parts.push(city);
          if (state) parts.push(state);
          if (postalCode) parts.push(postalCode);
          if (country) parts.push(country);

          const query = parts.join(", ");
          console.log("Geocoding address:", query);

          // Use Nominatim API for geocoding
          const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=1&addressdetails=1`;

          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            if (!isNaN(lat) && !isNaN(lng)) {
              console.log("Found coordinates:", { lat, lng });

              // Update location in formValues
              formValues.practiceDetails.address.location = { lat, lng };

              // Inform user that coordinates were found
              toast({
                title: "Location Found",
                description: "Your practice address was successfully geocoded.",
                variant: "default",
              });
            } else {
              console.log("Invalid coordinates returned from geocoding");

              // Add default location if geocoding failed
              const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Default to Tunis
              formValues.practiceDetails.address.location = defaultLocation;

              // Inform user about default location
              toast({
                title: "Using Default Location",
                description:
                  "Could not determine precise coordinates for your address. Using default location.",
                variant: "default",
              });
            }
          } else {
            console.log("No results found from geocoding");

            // Add default location if geocoding found no results
            const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Default to Tunis
            formValues.practiceDetails.address.location = defaultLocation;

            // Inform user about default location
            toast({
              title: "Using Default Location",
              description:
                "Could not find coordinates for your practice address. Using default location.",
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Error during geocoding:", error);

          // Add default location on error
          const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Default to Tunis
          formValues.practiceDetails.address.location = defaultLocation;

          // Inform user about default location
          toast({
            title: "Using Default Location",
            description:
              "An error occurred getting coordinates for your practice. Using default location.",
            variant: "default",
          });
        }
      }

      // Filter out any empty file objects from additional documents
      const additionalDocuments = (
        formValues.verificationDocuments?.additionalDocuments || []
      ).filter((doc: unknown): doc is File => doc instanceof File);

      // Create FormData for file uploads
      const formData = new FormData();

      // Add files to FormData
      if (formValues.verificationDocuments.identityProof instanceof File) {
        formData.append(
          "identityProof",
          formValues.verificationDocuments.identityProof
        );
      }
      if (formValues.verificationDocuments.medicalLicense instanceof File) {
        formData.append(
          "medicalLicense",
          formValues.verificationDocuments.medicalLicense
        );
      }
      if (formValues.personalInfo.profileImage instanceof File) {
        formData.append("profileImage", formValues.personalInfo.profileImage);
      }
      additionalDocuments.forEach((doc: File, index: number) => {
        formData.append(`additionalDocument${index}`, doc);
      });

      // Add other form data
      const jsonData = JSON.stringify({
        personalInfo: formValues.personalInfo,
        professionalInfo: formValues.professionalInfo,
        practiceDetails: formValues.practiceDetails,
        verificationDocuments: {
          termsAgreed: true,
        },
      });

      console.log("Sending data to /api/doctor-profile...");
      console.log("JSON data:", JSON.parse(jsonData));

      formData.append("data", jsonData);

      const response = await fetch("/api/doctor-profile", {
        method: "POST",
        body: formData,
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error response:", errorData);

        toast({
          title: "Submission Failed",
          description:
            errorData.error ||
            "There was a problem submitting your application. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      console.log("API Success response:", data);

      // Show success toast
      toast({
        title: "Application Submitted",
        description:
          "Your application has been received. We'll review it and get back to you soon.",
        variant: "default",
      });

      // Redirect to dashboard or confirmation page
      router.push("/doctor-application-received");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {formSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-primary border-primary text-white"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  index <= currentStep ? "text-primary" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary transition-all duration-300"
            style={{
              width: `${(currentStep / (formSteps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Get appropriate component for current step
  const StepComponent = currentFormStep.Component;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Doctor Application
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Complete your profile to join our healthcare network and connect with
          patients seeking quality care.
        </p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white rounded-lg">
        <FormProvider {...methods}>
          <form>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                {currentFormStep.title}
              </h2>
              <p className="text-gray-600">{currentFormStep.description}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="min-h-[40vh]"
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={formSteps.length}
              onBack={handleBack}
              onNext={handleNext}
              isSubmitting={isSubmitting}
              isLastStep={currentStep === formSteps.length - 1}
              isNextDisabled={
                currentStep === formSteps.length - 1
                  ? !hasRequiredFiles
                  : !isFormValid
              }
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default DoctorOnboardingForm;
