"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  showText?: boolean;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  showText = true,
  text = "Loading",
  className = "",
}) => {
  // Determine sizes based on the size prop
  const circleSize = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-2.5 w-2.5",
    lg: "h-4 w-4",
  }[size];

  const borderColorClass = `border-${color}`;
  const textColorClass = `text-${color}`;

  // Animation variants for the dots
  const dotVariants = {
    initial: {
      y: 0,
      opacity: 0.4,
    },
    animate: (i: number) => ({
      y: [0, -10, 0],
      opacity: [0.4, 1, 0.4],
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: i * 0.1,
        },
        opacity: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: i * 0.1,
        },
      },
    }),
  };

  // Animation variants for the pulse effect
  const pulseVariants = {
    initial: {
      scale: 0.95,
      opacity: 0.7,
    },
    animate: {
      scale: [0.95, 1.05, 0.95],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer pulsing circle */}
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className={`absolute inset-0 rounded-full bg-${color}/10 backdrop-blur-sm`}
        />

        {/* Main spinner */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
          className={`relative ${circleSize} rounded-full border-4 border-t-transparent ${borderColorClass}`}
        />

        {/* Inner circle with medical symbol */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div
            className={`${
              color === "primary" ? "text-primary" : `text-${color}-600`
            } font-bold`}
          >
            +
          </div>
        </div>
      </div>

      {showText && (
        <div className="mt-4 flex items-center">
          <span className={`font-medium ${textSize} ${textColorClass}`}>
            {text}
          </span>
          <div className="flex space-x-1 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                className={`${dotSize} rounded-full ${
                  color === "primary" ? "bg-primary" : `bg-${color}-600`
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
