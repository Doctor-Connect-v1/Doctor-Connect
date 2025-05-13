"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Uppercase letters
    if (/[a-z]/.test(password)) score += 1; // Lowercase letters
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters

    // Calculate final strength (0-4)
    let finalScore = 0;
    if (score >= 6) finalScore = 4; // Very strong
    else if (score >= 4) finalScore = 3; // Strong
    else if (score >= 3) finalScore = 2; // Medium
    else if (score >= 2) finalScore = 1; // Weak
    else finalScore = 0; // Very weak

    return finalScore;
  }, [password]);

  const strengthLabels = [
    "Very weak",
    "Weak",
    "Medium",
    "Strong",
    "Very strong",
  ];

  const strengthColors = [
    "bg-red-500", // Very weak
    "bg-orange-500", // Weak
    "bg-yellow-500", // Medium
    "bg-green-400", // Strong
    "bg-green-600", // Very strong
  ];

  const strengthLabel = password ? strengthLabels[strength] : "";
  const strengthColor = password ? strengthColors[strength] : "bg-gray-200";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex space-x-1 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-full flex-1 transition-colors duration-300",
                index <= strength && password ? strengthColor : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
      {password && (
        <p
          className={cn(
            "text-xs transition-colors",
            strength === 0
              ? "text-red-500"
              : strength === 1
              ? "text-orange-500"
              : strength === 2
              ? "text-yellow-600"
              : strength === 3
              ? "text-green-500"
              : "text-green-600"
          )}
        >
          {strengthLabel}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
