import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border transition-colors text-gray-900",
          "focus:ring-2 focus:ring-primary/20 focus:outline-none",
          "placeholder:text-gray-400",
          error
            ? "border-red-500 focus:border-red-500 bg-red-50/50"
            : "border-gray-300 focus:border-primary bg-white",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
