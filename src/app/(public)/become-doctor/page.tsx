import React from "react";
import DoctorOnboardingForm from "@/components/features/DoctorForm/DoctorOnboardingForm";

export const metadata = {
  title: "Become a Doctor | Medical Platform",
  description:
    "Join our network of healthcare professionals and help patients find the care they need.",
};

export default function BecomeDoctorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Join Our Network
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Become a verified doctor on our platform and connect with patients
            seeking quality healthcare.
          </p>
        </div>

        <DoctorOnboardingForm />
      </div>
    </div>
  );
}
