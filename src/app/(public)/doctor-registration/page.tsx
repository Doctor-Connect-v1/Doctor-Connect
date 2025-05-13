"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Stethoscope, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DoctorRegistrationPage() {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Stethoscope className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join DocConnect as a Healthcare Provider
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Share your expertise and expand your practice by joining our
              platform of healthcare professionals.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Benefits Section */}
          <div className="p-8 md:p-10 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Benefits of Joining
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Expand Your Patient Base
                  </h3>
                  <p className="text-gray-600">
                    Connect with new patients seeking your expertise and
                    specialization.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Efficient Scheduling
                  </h3>
                  <p className="text-gray-600">
                    Our platform handles appointment scheduling, reminders, and
                    confirmations.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Secure Telemedicine
                  </h3>
                  <p className="text-gray-600">
                    Conduct virtual consultations through our secure and
                    compliant platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Professional Profile
                  </h3>
                  <p className="text-gray-600">
                    Showcase your credentials, expertise, and services to
                    potential patients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-blue-50 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How to Get Started
            </h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-800 font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-600">
                    Provide your professional details, qualifications, and areas
                    of expertise.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-800 font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Submit Verification Documents
                  </h3>
                  <p className="text-gray-600">
                    Upload your medical license and other required credentials
                    for verification.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-800 font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Set Your Availability
                  </h3>
                  <p className="text-gray-600">
                    Define your working hours and appointment slots to manage
                    your schedule.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => router.push("/become-doctor")}
              className="w-full md:w-auto"
            >
              <span>Start Doctor Registration</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Already have a doctor account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
