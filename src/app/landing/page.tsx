import React from "react";
import HeroSection from "@/components/common/landing/HeroSection";
import ServicesSection from "@/components/common/landing/ServicesSection";
import DoctorsSection from "@/components/common/landing/DoctorsSection";
import ThreeDSection from "@/components/common/landing/ThreeDSection";
import TestimonialsSection from "@/components/common/landing/TestimonialsSection";
import Footer from "@/components/common/landing/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <ThreeDSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
