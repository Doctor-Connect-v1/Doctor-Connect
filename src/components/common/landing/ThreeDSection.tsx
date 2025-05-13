"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

// This is a simpler version than the full 3D animation component
// It uses image transformations and framer-motion to create a 3D-like effect
// Much lighter than a full Three.js implementation but still visually impressive

const ThreeDSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Text Content */}
          <motion.div
            className="lg:w-1/2 lg:pr-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Experience Healthcare on{" "}
              <span className="text-primary">Any Device</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              DocConnect works seamlessly across all your devices. Whether
              you're at home on your desktop, on the go with your phone, or
              using a tablet, manage your healthcare needs from anywhere.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Fully Responsive Design
                  </h3>
                  <p className="text-gray-600">
                    Our interface adapts beautifully to any screen size and
                    device type.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Synchronize Your Data
                  </h3>
                  <p className="text-gray-600">
                    All your appointments and health records stay synchronized
                    across devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Mobile Notifications
                  </h3>
                  <p className="text-gray-600">
                    Get timely reminders for appointments and medication on all
                    your devices.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg">
              <ArrowRight className="h-5 w-5 mr-2" />
              Try It Now
            </Button>
          </motion.div>

          {/* Right Side - 3D-like Display */}
          <div ref={ref} className="lg:w-1/2 relative h-[500px]">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

            {/* Desktop Display */}
            <motion.div
              className="absolute left-[5%] top-[10%] w-[90%] z-20"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=2070"
                  alt="Desktop version of DocConnect"
                  width={600}
                  height={350}
                  className="rounded-t-lg shadow-2xl border border-gray-200"
                  priority
                />
                <div className="h-6 bg-gray-800 rounded-b-lg relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Tablet Display */}
            <motion.div
              className="absolute right-[5%] bottom-[5%] w-[45%] z-30"
              initial={{ opacity: 0, x: 60, rotateZ: 10 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, rotateZ: 0 }
                  : { opacity: 0, x: 60, rotateZ: 10 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl border-8 border-gray-800 shadow-xl"></div>
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
                  alt="Tablet version of DocConnect"
                  width={300}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </motion.div>

            {/* Mobile Display */}
            <motion.div
              className="absolute left-[10%] bottom-[15%] w-[25%] z-40"
              initial={{ opacity: 0, x: -40, rotateZ: -5 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, rotateZ: 0 }
                  : { opacity: 0, x: -40, rotateZ: -5 }
              }
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl border-[6px] border-gray-800 shadow-xl"></div>
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070"
                  alt="Mobile version of DocConnect"
                  width={150}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDSection;
