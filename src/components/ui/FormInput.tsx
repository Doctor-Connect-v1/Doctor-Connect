import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, icon, rightIcon, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none text-gray-900 placeholder:text-gray-400",
              icon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-red-500 focus:border-red-500 bg-red-50/50"
                : "border-gray-300 focus:border-primary bg-white",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
