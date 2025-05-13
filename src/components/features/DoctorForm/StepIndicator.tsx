import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    isActive && "border-primary bg-primary text-white",
                    isCompleted && "border-primary bg-primary text-white",
                    !isActive && !isCompleted && "border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connecting Line (except after last item) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 w-full max-w-24 rounded-full",
                    currentStep > index ? "bg-primary" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
