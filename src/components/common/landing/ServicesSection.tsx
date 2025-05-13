"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CalendarClock,
  VideoIcon,
  MessageSquare,
  ClipboardList,
  CreditCard,
  FileText,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ServiceCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
    >
      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <CalendarClock className="h-8 w-8 text-primary" />,
      title: "Online Scheduling",
      description:
        "Book appointments with your preferred doctors at your convenience, 24/7.",
    },
    {
      icon: <VideoIcon className="h-8 w-8 text-primary" />,
      title: "Video Consultations",
      description:
        "Connect with healthcare professionals from the comfort of your home.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Secure Messaging",
      description:
        "Send and receive messages from your healthcare team in a secure environment.",
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: "Medical Records",
      description:
        "Access your complete medical history and test results from anywhere.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Easy Payments",
      description:
        "Pay for consultations, prescriptions and services with multiple payment options.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Digital Prescriptions",
      description:
        "Receive prescriptions digitally and get them filled at your preferred pharmacy.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Our <span className="text-primary">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Comprehensive healthcare solutions that connect patients and doctors
            seamlessly
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white px-6 py-5 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <Bell className="h-6 w-6 text-primary" />
              <p className="text-gray-700 font-medium">
                Get notifications for appointments and doctor availability
              </p>
              <Button variant="default" size="sm">
                Enable Alerts
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
