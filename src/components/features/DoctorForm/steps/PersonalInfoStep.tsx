"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import DatePicker from "@/components/ui/DatePicker";
import FormField from "@/components/ui/FormField";
import { Users } from "lucide-react";

const PersonalInfoStep = () => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useFormContext();

  // Watch bio for updates
  const bio = watch("bio") || "";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Calculate remaining characters for bio
  const MAX_BIO_LENGTH = 500;
  const MIN_BIO_LENGTH = 50;
  const remainingChars = MAX_BIO_LENGTH - bio.length;
  const isBioTooShort = bio.length > 0 && bio.length < MIN_BIO_LENGTH;

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("profileImage", file, { shouldValidate: true });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
        <p className="text-gray-600 mt-2">
          Please provide your contact information and personal details
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          label="Phone Number"
          error={errors.phone?.message as string}
          hint="Enter a phone number between 4 and 15 digits"
        >
          <Input
            {...register("phone")}
            placeholder="Enter your phone number"
            error={!!errors.phone}
          />
        </FormField>

        <FormField
          label="Date of Birth"
          error={errors.dateOfBirth?.message as string}
        >
          <DatePicker
            name="dateOfBirth"
            control={control}
            error={!!errors.dateOfBirth}
            maxDate={new Date()}
            setValue={setValue}
          />
        </FormField>

        <FormField
          label="Professional Bio"
          error={errors.bio?.message as string}
          hint={`Minimum ${MIN_BIO_LENGTH} characters. Describe your medical background, approach to patient care, and any notable achievements.`}
        >
          <div className="relative">
            <TextArea
              {...register("bio", {
                minLength: {
                  value: MIN_BIO_LENGTH,
                  message: `Bio must be at least ${MIN_BIO_LENGTH} characters`,
                },
                maxLength: {
                  value: MAX_BIO_LENGTH,
                  message: `Bio cannot exceed ${MAX_BIO_LENGTH} characters`,
                },
              })}
              placeholder="Enter your professional bio here..."
              rows={5}
              error={!!errors.bio}
              className="pr-20"
            />
            <div
              className={`absolute bottom-3 right-3 text-sm px-2 py-1 rounded-md ${
                isBioTooShort
                  ? "bg-yellow-100 text-yellow-800"
                  : remainingChars < 50
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isBioTooShort ? (
                <span>Need {MIN_BIO_LENGTH - bio.length} more</span>
              ) : (
                <span>{remainingChars} left</span>
              )}
            </div>
          </div>
        </FormField>

        <FormField label="Gender" error={errors.gender?.message?.toString()}>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="male"
                {...register("gender")}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border ${
                  watch("gender") === "male"
                    ? "border-4 border-primary"
                    : "border border-gray-400"
                } mr-2`}
              ></div>
              <span
                className={`${
                  watch("gender") === "male"
                    ? "text-primary font-medium"
                    : "text-gray-800"
                }`}
              >
                Male
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border ${
                  watch("gender") === "female"
                    ? "border-4 border-primary"
                    : "border border-gray-400"
                } mr-2`}
              ></div>
              <span
                className={`${
                  watch("gender") === "female"
                    ? "text-primary font-medium"
                    : "text-gray-800"
                }`}
              >
                Female
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="other"
                {...register("gender")}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border ${
                  watch("gender") === "other"
                    ? "border-4 border-primary"
                    : "border border-gray-400"
                } mr-2`}
              ></div>
              <span
                className={`${
                  watch("gender") === "other"
                    ? "text-primary font-medium"
                    : "text-gray-800"
                }`}
              >
                Other
              </span>
            </label>
          </div>
        </FormField>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
            Profile Image
          </label>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col items-center">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
              <label
                htmlFor="profileImage"
                className="inline-block px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary-dark transition-colors"
              >
                {previewUrl ? "Change Image" : "Upload Image"}
              </label>
              {previewUrl && (
                <button
                  type="button"
                  className="mt-2 text-red-500 text-sm hover:underline"
                  onClick={() => {
                    setValue("profileImage", undefined);
                    setPreviewUrl(null);
                  }}
                >
                  Remove
                </button>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Recommended: Square image, at least 300x300px
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
