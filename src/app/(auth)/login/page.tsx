"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/common/landing/AuthLayout";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Login successful:", data);

      // Check if email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        // Email not confirmed - redirect to email confirmation page
        console.log("Email not confirmed, redirecting to confirmation page");
        router.push(`/email-confirmation?email=${encodeURIComponent(email)}`);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login failed:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    } catch (err: unknown) {
      console.error("Google login failed:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Google login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your DocConnect account"
      authType="login"
    >
      {message && (
        <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          placeholder="john@example.com"
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full py-2.5"
            size="lg"
            isLoading={isSubmitting}
          >
            Sign In
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
            text="Sign in with Google"
            onClick={handleGoogleLogin}
          />
        </div>
      </form>
    </AuthLayout>
  );
}
