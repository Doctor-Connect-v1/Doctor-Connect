"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "DocConnect transformed how I manage my healthcare. I was able to find a specialist and book an appointment within minutes. The video consultation feature saved me hours of travel time!",
    name: "Emily Rodriguez",
    role: "Patient",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2576",
    rating: 5,
  },
  {
    id: 2,
    content:
      "As a practicing physician for over 15 years, I've seen how technology can improve healthcare delivery. DocConnect streamlines my practice operations and allows me to focus more on patient care.",
    name: "Dr. Michael Chang",
    role: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2940",
    rating: 5,
  },
  {
    id: 3,
    content:
      "I was skeptical about telemedicine at first, but DocConnect made the experience so seamless. I received the same quality care as an in-person visit, and my doctor was able to send my prescription directly to my pharmacy.",
    name: "James Wilson",
    role: "Patient",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=2940",
    rating: 4,
  },
  {
    id: 4,
    content:
      "DocConnect's platform has revolutionized my pediatric practice. Parents love the easy scheduling and secure messaging feature for follow-up questions. It's made healthcare more accessible for busy families.",
    name: "Dr. Sarah Johnson",
    role: "Pediatrician",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2940",
    rating: 5,
  },
];

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative"
    >
      <div className="absolute top-6 right-6 text-primary">
        <Quote className="h-8 w-8 rotate-180 opacity-20" />
      </div>

      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 mr-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>

      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <p className="text-gray-700">{testimonial.content}</p>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            What People Are <span className="text-primary">Saying</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Hear from patients and healthcare providers who have experienced the
            benefits of our platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-primary/10 px-6 py-3 rounded-full">
            <p className="text-primary font-medium">
              Join 10,000+ users who have improved their healthcare experience
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
