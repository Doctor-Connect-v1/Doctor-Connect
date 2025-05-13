"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Plus, Trash2, Award, FileText, Clock } from "lucide-react";

// Comprehensive list of medical specializations
const SPECIALIZATIONS = [
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "General Surgery",
  "Psychiatry",
  "Anesthesiology",
  "Emergency Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Radiology",
  "Pathology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Urology",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
  "Rheumatology",
  "Nephrology",
  "Hematology",
  "Oncology",
  "Allergy & Immunology",
  "Geriatrics",
  "Infectious Disease",
  "Plastic Surgery",
  "Thoracic Surgery",
  "Vascular Surgery",
  "Neurosurgery",
  "Sports Medicine",
  "Pain Management",
  "Sleep Medicine",
  "Palliative Care",
  "Clinical Genetics",
  "Medical Informatics",
  "Lifestyle Medicine",
  "Other",
];

// List of languages
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Arabic",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Japanese",
  "Korean",
  "Hindi",
  "Urdu",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Marathi",
  "Turkish",
  "Persian/Farsi",
  "Vietnamese",
  "Thai",
  "Indonesian",
  "Malay",
  "Tagalog/Filipino",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Slovak",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Greek",
  "Hebrew",
  "Ukrainian",
  "Swahili",
  "Amharic",
  "Somali",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Zulu",
  "Afrikaans",
  "Other",
];

// Type definition for qualifications errors
type QualificationErrors = {
  degree?: { message?: string };
  institution?: { message?: string };
  year?: { message?: string };
};

const ProfessionalInfoStep = () => {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  const currentYear = new Date().getFullYear();
  const [otherLanguage, setOtherLanguage] = useState("");
  const selectedLanguages = watch("languages") || [];

  // Initialize languages array if empty
  React.useEffect(() => {
    if (!getValues("languages")) {
      setValue("languages", [], { shouldValidate: true });
    }
  }, [getValues, setValue]);

  const addQualification = () => {
    append({
      degree: "",
      institution: "",
      year: currentYear,
    });
  };

  const addOtherLanguage = () => {
    if (
      otherLanguage.trim() &&
      !selectedLanguages.includes(otherLanguage.trim())
    ) {
      const updatedLanguages = [...selectedLanguages, otherLanguage.trim()];
      setValue("languages", updatedLanguages, { shouldValidate: true });
      setOtherLanguage("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    const updatedLanguages = selectedLanguages.filter(
      (lang: string) => lang !== language
    );
    setValue("languages", updatedLanguages, { shouldValidate: true });
  };

  // Safely access qualification errors
  const getQualificationError = (
    index: number,
    field: keyof QualificationErrors
  ) => {
    const qualificationErrors = errors.qualifications as
      | Record<number, QualificationErrors>
      | undefined;
    return qualificationErrors?.[index]?.[field]?.message;
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Specialization"
        error={errors.specialization?.message as string}
      >
        <div className="relative">
          <Award size={18} className="absolute top-3.5 left-3 text-gray-500" />
          <select
            className={`w-full px-4 py-2.5 pl-10 rounded-lg border transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none text-gray-900 ${
              errors.specialization
                ? "border-red-500 focus:border-red-500 bg-red-50/50"
                : "border-gray-300 focus:border-primary bg-white"
            }`}
            {...register("specialization")}
          >
            <option value="">Select your specialization</option>
            {SPECIALIZATIONS.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>
      </FormField>

      <FormField
        label="License Number"
        error={errors.licenseNumber?.message as string}
      >
        <div className="relative">
          <FileText
            size={18}
            className="absolute top-3.5 left-3 text-gray-500"
          />
          <Input
            placeholder="Enter your medical license number"
            className="pl-10"
            error={!!errors.licenseNumber}
            {...register("licenseNumber")}
          />
        </div>
      </FormField>

      <FormField
        label="Years of Experience"
        error={errors.experience?.message as string}
      >
        <div className="relative">
          <Clock size={18} className="absolute top-3.5 left-3 text-gray-500" />
          <Input
            type="number"
            min={0}
            placeholder="Years of practice"
            className="pl-10"
            error={!!errors.experience}
            {...register("experience", { valueAsNumber: true })}
          />
        </div>
      </FormField>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Qualifications
        </label>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex justify-between mb-2">
              <h4 className="font-medium text-primary">
                Qualification #{index + 1}
              </h4>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Degree/Certification
                </label>
                <Input
                  placeholder="e.g., MD, PhD, MBBS"
                  error={!!getQualificationError(index, "degree")}
                  {...register(`qualifications.${index}.degree`)}
                />
                {getQualificationError(index, "degree") && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {String(getQualificationError(index, "degree"))}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Institution
                </label>
                <Input
                  placeholder="University/Institution name"
                  error={!!getQualificationError(index, "institution")}
                  {...register(`qualifications.${index}.institution`)}
                />
                {getQualificationError(index, "institution") && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {String(getQualificationError(index, "institution"))}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Year
              </label>
              <Input
                type="number"
                min="1950"
                max={currentYear}
                error={!!getQualificationError(index, "year")}
                {...register(`qualifications.${index}.year`, {
                  valueAsNumber: true,
                })}
              />
              {getQualificationError(index, "year") && (
                <p className="mt-1.5 text-sm text-red-600">
                  {String(getQualificationError(index, "year"))}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQualification}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          <span>Add Qualification</span>
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Languages
        </label>

        <div className="mb-3 flex flex-wrap gap-2">
          {selectedLanguages.map((language: string) => (
            <span
              key={language}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-white"
            >
              {language}
              <button
                type="button"
                onClick={() => handleRemoveLanguage(language)}
                className="ml-1.5 text-white hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <select
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-gray-900 bg-white"
              value={otherLanguage}
              onChange={(e) => setOtherLanguage(e.target.value)}
            >
              <option value="" className="text-gray-900">
                Select a language
              </option>
              {LANGUAGES.filter(
                (lang) => !selectedLanguages.includes(lang)
              ).map((language) => (
                <option
                  key={language}
                  value={language}
                  className="text-gray-900"
                >
                  {language}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addOtherLanguage}
            disabled={!otherLanguage}
            className="px-4 py-2.5 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        {errors.languages && (
          <p className="mt-1.5 text-sm text-red-600">
            {String(errors.languages.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
