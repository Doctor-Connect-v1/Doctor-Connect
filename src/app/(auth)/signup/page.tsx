"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/common/landing/AuthLayout";
import FormInput from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and a number";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Basic validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Save the password temporarily for email verification session
      // It will be used to maintain the session during verification
      localStorage.setItem("tempPassword", formData.password);

      // Log signup result
      console.log("Signup successful", data);

      // Redirect to email confirmation page
      router.push(
        `/email-confirmation?email=${encodeURIComponent(formData.email)}`
      );
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during signup. Please try again.";
      setErrors({
        form: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // The user will be redirected to Google for authentication
    } catch (error: unknown) {
      console.error("Google signup failed", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during Google signup. Please try again.";
      setErrors({
        form: errorMessage,
      });
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join DocConnect to manage your healthcare experience"
      authType="signup"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div className="space-y-4">
          <FormInput
            label="Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {formData.password && (
            <div className="px-1">
              <PasswordStrengthMeter password={formData.password} />
            </div>
          )}
        </div>

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        {formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword ? (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Passwords match</span>
          </div>
        ) : null}

        {errors.form && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full py-2.5"
            size="lg"
            isLoading={isSubmitting}
          >
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <GoogleButton
            text="Sign up with Google"
            onClick={handleGoogleSignup}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
