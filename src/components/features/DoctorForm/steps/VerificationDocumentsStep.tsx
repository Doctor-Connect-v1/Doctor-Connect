"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, File, Plus, X, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";

const VerificationDocumentsStep = () => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    getValues,
    watch,
  } = useFormContext();

  const [additionalDocFiles, setAdditionalDocFiles] = useState<File[]>(
    getValues("verificationDocuments.additionalDocuments") || []
  );

  // Watch for current values
  const identityProof = watch("verificationDocuments.identityProof");
  const medicalLicense = watch("verificationDocuments.medicalLicense");
  const termsAgreed = watch("verificationDocuments.termsAgreed");

  // Handle identity proof upload
  const handleIdentityProofChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Setting identity proof file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Set the file in form context
      setValue("verificationDocuments.identityProof", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Trigger validation for the entire verification documents section
      trigger("verificationDocuments").then((isValid) => {
        console.log("Identity proof validation result:", isValid);
        if (!isValid) {
          console.log(
            "Identity proof validation errors:",
            errors.verificationDocuments
          );
        }
      });
    }
  };

  // Handle medical license upload
  const handleMedicalLicenseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Setting medical license file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Set the file in form context
      setValue("verificationDocuments.medicalLicense", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Trigger validation for the entire verification documents section
      trigger("verificationDocuments").then((isValid) => {
        console.log("Medical license validation result:", isValid);
        if (!isValid) {
          console.log(
            "Medical license validation errors:",
            errors.verificationDocuments
          );
        }
      });
    }
  };

  // Handle additional documents upload
  const handleAdditionalDocsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...additionalDocFiles, ...newFiles];
      console.log(
        "Setting additional documents:",
        updatedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      );

      setAdditionalDocFiles(updatedFiles);
      setValue("verificationDocuments.additionalDocuments", updatedFiles, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Trigger validation for the entire verification documents section
      trigger("verificationDocuments").then((isValid) => {
        console.log("Additional documents validation result:", isValid);
      });
    }
  };

  // Handle removing an additional document
  const handleRemoveAdditionalDoc = (index: number) => {
    const updatedFiles = additionalDocFiles.filter((_, i) => i !== index);
    setAdditionalDocFiles(updatedFiles);
    setValue("verificationDocuments.additionalDocuments", updatedFiles, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    trigger("verificationDocuments");
  };

  // Format file size for display
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render file info
  const renderFileInfo = (file: File) => {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <File size={16} className="text-gray-500" />
        <span className="truncate max-w-xs">{file.name}</span>
        <span className="text-gray-500">({formatFileSize(file.size)})</span>
      </div>
    );
  };

  // Define error type for better type safety
  type NestedFieldError = {
    identityProof?: { message?: string };
    medicalLicense?: { message?: string };
    termsAgreed?: { message?: string };
  };

  return (
    <div className="space-y-6">
      {/* Identity Proof */}
      <FormField
        label="Identity Proof (ID Card, Passport, etc.)"
        error={
          (errors.verificationDocuments as NestedFieldError)?.identityProof
            ?.message
        }
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          {identityProof ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                {renderFileInfo(identityProof as File)}
                <button
                  type="button"
                  onClick={() => {
                    setValue("verificationDocuments.identityProof", undefined, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    trigger("verificationDocuments");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center text-green-600 text-sm">
                <Check size={16} className="mr-1" />
                <span>Document uploaded</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("identity-proof-input")?.click()
                }
                className="text-sm text-primary hover:text-primary-dark underline mt-2"
              >
                Replace document
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, or PNG (max. 10MB)
                </p>
              </div>

              <input
                id="identity-proof-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleIdentityProofChange}
              />

              <button
                type="button"
                onClick={() =>
                  document.getElementById("identity-proof-input")?.click()
                }
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Upload size={16} className="mr-2" />
                Upload Document
              </button>
            </div>
          )}
        </div>
      </FormField>

      {/* Medical License */}
      <FormField
        label="Medical License"
        error={
          (errors.verificationDocuments as NestedFieldError)?.medicalLicense
            ?.message
        }
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          {medicalLicense ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                {renderFileInfo(medicalLicense as File)}

                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "verificationDocuments.medicalLicense",
                      undefined,
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center text-green-600 text-sm">
                <Check size={16} className="mr-1" />
                <span>License uploaded</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("medical-license-input")?.click()
                }
                className="text-sm text-primary hover:text-primary-dark underline mt-2"
              >
                Replace document
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, or PNG (max. 10MB)
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("medical-license-input")?.click()
                }
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Upload size={16} className="mr-2" />
                Upload Document
              </button>
            </div>
          )}

          <input
            id="medical-license-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleMedicalLicenseChange}
          />
        </div>
      </FormField>

      {/* Additional Documents */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional Documents (Optional)
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="space-y-2">
            {additionalDocFiles.length > 0 && (
              <div className="space-y-2">
                {additionalDocFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                  >
                    {renderFileInfo(file)}
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalDoc(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("additional-docs-input")?.click()
                }
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus size={16} className="mr-2" />
                Add Document
              </button>
            </div>
          </div>

          <input
            id="additional-docs-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            multiple
            onChange={handleAdditionalDocsChange}
          />
        </div>
      </div>

      {/* Terms and Agreement */}
      <FormField
        label="Terms and Conditions"
        error={
          (errors.verificationDocuments as NestedFieldError)?.termsAgreed
            ?.message
        }
      >
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              {...register("verificationDocuments.termsAgreed", {
                onChange: () => {
                  console.log(
                    "Terms agreed changed, current value:",
                    !termsAgreed
                  );
                  trigger("verificationDocuments").then((isValid) => {
                    console.log("Terms validation result:", isValid);
                    if (!isValid) {
                      console.log(
                        "Terms validation errors:",
                        errors.verificationDocuments
                      );
                    }
                  });
                },
              })}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Terms and Conditions
            </label>
            <p className="text-gray-500">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                terms of service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                privacy policy
              </a>
              . I certify that all information provided is accurate and
              complete.
            </p>
          </div>
        </div>
      </FormField>
    </div>
  );
};

export default VerificationDocumentsStep;
