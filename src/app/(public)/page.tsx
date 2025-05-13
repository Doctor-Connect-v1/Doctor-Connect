"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Stethoscope,
  User,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { handleDoctorRedirect } from "@/lib/auth/userRoles";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const supabase = createClient();

  // Handle clicking on "Provide Care" button
  const handleProvideCareBtnClick = async () => {
    setIsRedirecting(true);
    await handleDoctorRedirect(router);
  };

  useEffect(() => {
    // Check if user is authenticated
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        // Add a small delay to ensure smooth transitions
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Add a small delay to ensure smooth transitions
      setTimeout(() => setIsLoading(false), 300);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    // Redirect to landing page if not authenticated and finished loading
    if (!isLoading && !user) {
      router.push("/landing");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <LoadingSpinner
          size="lg"
          color="primary"
          text="Checking authentication"
        />
      </div>
    );
  }

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        type: "spring",
        damping: 15,
      },
    }),
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.98,
      boxShadow:
        "0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.1 },
    },
  };

  // Icon variants
  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.4 + i * 0.2,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden min-h-[calc(100vh-8rem)] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900"
          >
            Welcome to{" "}
            <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              DocConnect
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            Please select how you would like to use our platform today.
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-10 max-w-6xl mx-auto">
          {/* Find a Doctor Option */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onClick={() => router.push("/patient")}
            className="bg-white rounded-xl overflow-hidden w-full max-w-md cursor-pointer border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-36 md:h-44 bg-gradient-to-r from-green-50 to-emerald-100 p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-gray-500 font-medium">For Patients</h3>
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  Find a Doctor
                </h2>
              </div>
              <motion.div
                className="bg-white/90 rounded-full p-4 shadow-md"
                variants={iconVariants}
                custom={0}
              >
                <Calendar className="h-8 w-8 text-primary" />
              </motion.div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  <p className="text-gray-700 font-medium">
                    Book consultations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <p className="text-gray-700 font-medium">
                    Schedule appointments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                  <p className="text-gray-700 font-medium">
                    Access medical services
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center text-primary font-medium">
                  <span>Browse available doctors</span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Healthcare Provider Option */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            onClick={handleProvideCareBtnClick}
            className="bg-white rounded-xl overflow-hidden w-full max-w-md cursor-pointer border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-36 md:h-44 bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-gray-500 font-medium">For Professionals</h3>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                  Provide Care
                </h2>
              </div>
              <motion.div
                className="bg-white/90 rounded-full p-4 shadow-md"
                variants={iconVariants}
                custom={1}
              >
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </motion.div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700 font-medium">
                    Connect with patients
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700 font-medium">
                    Manage appointments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700 font-medium">
                    Deliver healthcare services
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center text-blue-600 font-medium">
                  {isRedirecting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Checking account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Start providing care</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 md:mt-16 text-center"
        >
          <p className="text-gray-600">
            Not sure which option to choose?{" "}
            <motion.span
              className="text-primary underline cursor-pointer hover:text-primary/80 transition-colors inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn more
            </motion.span>{" "}
            about our platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
