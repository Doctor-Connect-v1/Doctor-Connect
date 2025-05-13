"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CalendarCheck, Phone, MessageSquare } from "lucide-react";
import AnimatedElement from "@/components/common/landing/AnimatedElement";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Modern Healthcare at Your
              <span className="text-primary"> Fingertips</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              Connect with top doctors, schedule appointments online, and manage
              your healthcare journey seamlessly with DocConnect's innovative
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg">
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Talk to a Doctor
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Booking</h3>
                  <p className="text-sm text-gray-600">Schedule in minutes</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Video Consults
                  </h3>
                  <p className="text-sm text-gray-600">
                    Face-to-face care online
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure Messages
                  </h3>
                  <p className="text-sm text-gray-600">Private communication</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Image or 3D Element */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative h-[500px] w-full lg:w-auto"
          >
            <div className="absolute -left-16 -top-16 w-72 h-72 bg-primary/10 rounded-full z-0 blur-3xl"></div>
            <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-secondary/10 rounded-full z-0 blur-3xl"></div>

            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
              <div className="absolute top-8 right-8 bg-primary text-white text-xs px-3 py-1 rounded-full">
                Premium Care
              </div>

              <Image
                src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=2787"
                alt="Doctor with patient"
                className="w-full h-[320px] object-cover object-center rounded-xl shadow-md"
                width={600}
                height={400}
                priority
              />

              <div className="mt-6 flex items-center">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2940"
                  alt="Doctor profile"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white shadow-md"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    Dr. Sarah Johnson
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cardiologist • Available Today
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" variant="outline">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
