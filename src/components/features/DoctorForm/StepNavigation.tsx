import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting = false,
  isLastStep = false,
  isNextDisabled = false,
}) => {
  return (
    <div className="flex justify-between items-center mt-12">
      <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}>
        <Button
          type="button"
          variant={currentStep === 0 ? "ghost" : "outline"}
          onClick={onBack}
          disabled={currentStep === 0 || isSubmitting}
          className="px-6 py-2.5 flex items-center gap-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </motion.div>

      <div className="text-sm text-gray-500">
        Step {currentStep + 1} of {totalSteps}
      </div>

      <motion.div
        whileHover={!isNextDisabled ? { x: 3 } : {}}
        whileTap={!isNextDisabled ? { scale: 0.97 } : {}}
      >
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          className={`px-6 py-2.5 flex items-center gap-2 ${
            isLastStep
              ? "bg-primary hover:bg-primary/90"
              : "bg-primary hover:bg-primary/90"
          } text-white disabled:opacity-50 disabled:bg-gray-400 transition-all duration-200`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isLastStep ? "Submitting..." : "Saving..."}
            </>
          ) : (
            <>
              {isLastStep ? (
                <>
                  <span>Submit Application</span>
                  <Check size={16} />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={16} />
                </>
              )}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default StepNavigation;
