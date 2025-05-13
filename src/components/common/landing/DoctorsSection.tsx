"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Sample data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2940",
    rating: 4.9,
    reviews: 124,
    available: true,
    education: "Harvard Medical School",
    experience: "15+ years",
  },
  {
    id: 2,
    name: "Dr. Robert Chen",
    specialty: "Neurologist",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2940",
    rating: 4.8,
    reviews: 98,
    available: true,
    education: "Johns Hopkins University",
    experience: "12+ years",
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    specialty: "Pediatrician",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=2787",
    rating: 4.7,
    reviews: 156,
    available: false,
    education: "Stanford Medical School",
    experience: "10+ years",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=2864",
    rating: 4.6,
    reviews: 87,
    available: true,
    education: "Yale School of Medicine",
    experience: "8+ years",
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=2787",
    rating: 4.9,
    reviews: 112,
    available: true,
    education: "Columbia University",
    experience: "14+ years",
  },
];

const DoctorCard = ({ doctor }: { doctor: (typeof doctors)[0] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100 flex flex-col min-w-[280px] max-w-[320px]">
      <div className="relative">
        <Image
          src={doctor.image}
          alt={doctor.name}
          width={320}
          height={220}
          className="h-48 w-full object-cover"
        />
        {doctor.available ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Available Today
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Not Available
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
        <p className="text-primary text-sm mb-2">{doctor.specialty}</p>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm text-gray-800">{doctor.rating}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            {doctor.reviews} reviews
          </span>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-500">
              Education:
            </span>
            <span className="text-sm text-gray-700">{doctor.education}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-500">
              Experience:
            </span>
            <span className="text-sm text-gray-700">{doctor.experience}</span>
          </div>
        </div>

        <Button
          className="w-full mt-auto"
          variant={doctor.available ? "default" : "outline"}
          disabled={!doctor.available}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

const DoctorsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 340; // Roughly the width of a card + gap

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Meet Our <span className="text-primary">Specialists</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl"
            >
              Connect with top-rated doctors across various specialties, ready
              to provide you with the best care
            </motion.p>
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-8 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: doctor.id * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline" size="lg">
            View All Doctors
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorsSection;
