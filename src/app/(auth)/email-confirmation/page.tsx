"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/common/landing/AuthLayout";
import Button from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  subscribeToUsers,
  unsubscribeFromUsers,
} from "@/lib/supabase/realtime";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function EmailConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(60); // Start with 60 seconds
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState(emailParam);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes connection time
  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist email and user ID to local storage
  useEffect(() => {
    // If email is in URL params, save it to localStorage
    if (emailParam) {
      console.log("Saving email from URL params to localStorage:", emailParam);
      localStorage.setItem("verificationEmail", emailParam);
      setEmail(emailParam);
    } else {
      // Try to get email from localStorage
      const savedEmail = localStorage.getItem("verificationEmail");
      if (savedEmail) {
        console.log("Retrieved email from localStorage:", savedEmail);
        setEmail(savedEmail);
      }
    }

    // Try to get userId from localStorage
    const savedUserId = localStorage.getItem("verificationUserId");
    if (savedUserId) {
      console.log("Retrieved userId from localStorage:", savedUserId);
      setUserId(savedUserId);
    }
  }, [emailParam]);

  // Handle countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle timeout counter
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Log every 30 seconds
        if (timeLeft % 30 === 0) {
          console.log(
            `⏱️ Waiting for email verification: ${timeLeft} seconds remaining`
          );
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      console.log("⏱️ Verification time limit reached (3 minutes)");
      setMessage({
        type: "info",
        text: "Verification time limit reached. You can try again or check your email later.",
      });
    }
  }, [timeLeft]);

  // Hook to send verification email on page load
  useEffect(() => {
    if (email) {
      // Send the verification email immediately on page load
      const sendVerificationEmail = async () => {
        try {
          console.log("Sending verification email to:", email);
          const supabase = createClient();
          const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
          });

          if (error) {
            if (
              error.message.includes("rate limit") ||
              error.message.includes("security purposes")
            ) {
              console.log(
                "Rate limited. Email was probably already sent:",
                error.message
              );
              setMessage({
                type: "info",
                text: "Email was already sent recently. Please check your inbox and spam folder.",
              });
            } else {
              console.error("Error sending verification email:", error);
              setMessage({
                type: "error",
                text: "Failed to send verification email. You can try the resend button below.",
              });
            }
          } else {
            console.log("✅ Verification email sent successfully");
            setCountdown(60);
            setMessage({
              type: "success",
              text: "Verification email sent! Please check your inbox and spam folder.",
            });
          }
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
      };

      sendVerificationEmail();
    }
  }, [email]); // Only run when email changes

  // Monitor email confirmation via realtime
  useEffect(() => {
    let isActive = true; // Track if this effect is still active
    console.log("Setting up email confirmation monitoring...");
    console.log(`⏱️ Verification will be monitored for ${timeLeft} seconds`);

    // Setup the verification monitoring
    const setupVerificationMonitoring = async () => {
      try {
        const supabase = createClient();
        let user = null;

        // Try to get user from current session
        const { data: sessionData } = await supabase.auth.getSession();

        // Log session data to debug
        console.log("Current session data:", sessionData);

        if (sessionData.session) {
          user = sessionData.session.user;
          console.log("Got user from session:", user.id);
        } else {
          // If no session, try to sign in with saved email
          if (email) {
            console.log(
              "No session found. Trying to restore session for:",
              email
            );
            try {
              // Check if we have saved credentials in localStorage
              const savedPassword = localStorage.getItem("tempPassword");

              if (savedPassword) {
                console.log("Attempting to sign in to maintain session...");
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: email,
                  password: savedPassword,
                });

                if (error) {
                  console.error("Error signing in:", error);
                } else if (data.user) {
                  user = data.user;
                  console.log(
                    "Successfully signed in to maintain session:",
                    user.id
                  );
                }
              }
            } catch (signInError) {
              console.error("Error during session restoration:", signInError);
            }
          }
        }

        // Save user data to localStorage
        if (user?.id) {
          localStorage.setItem("verificationUserId", user.id);
          setUserId(user.id);
          console.log("User ID saved:", user.id);
        }

        if (user?.email && !email) {
          localStorage.setItem("verificationEmail", user.email);
          setEmail(user.email);
          console.log("User email saved:", user.email);
        }

        // Check if already verified
        if (user?.email_confirmed_at || user?.user_metadata?.email_verified) {
          console.log("Email already confirmed! Redirecting...");
          router.push("/patient");
          return;
        }

        // Setup regular session checks for verification
        const checkEmailVerification = async () => {
          if (!isActive) return;

          try {
            console.log("Performing periodic verification check...");
            const { data } = await supabase.auth.refreshSession();

            if (data.user?.id) {
              console.log("User state:", {
                id: data.user.id,
                email: data.user.email,
                confirmed: !!data.user.email_confirmed_at,
                metadata: data.user.user_metadata,
              });

              // Check if verified
              if (
                data.user.email_confirmed_at ||
                data.user.user_metadata?.email_verified
              ) {
                console.log(
                  "✅ Email verification detected in periodic check!"
                );
                setMessage({
                  type: "success",
                  text: "Email verified successfully! Redirecting...",
                });

                setTimeout(() => {
                  if (isActive) router.push("/patient");
                }, 1000);
              }
            } else {
              console.log("No user data in session check");
            }
          } catch (error) {
            console.error("Error checking verification status:", error);
          }
        };

        // Set up subscription with realtime
        const channel = subscribeToUsers((payload) => {
          console.log(
            "📣 Received update from realtime subscription:",
            payload
          );

          // We got a notification - check if the user is verified now
          checkEmailVerification();
        });

        channelRef.current = channel;

        // Check immediately
        checkEmailVerification();

        // Set up periodic verification check
        const checkInterval = setInterval(() => {
          if (!isActive) return;
          checkEmailVerification();
        }, 5000);

        // Store reference to clear later
        verificationTimerRef.current = checkInterval;

        // Set up a one-time check at the end of the waiting period
        const finalCheck = setTimeout(async () => {
          if (!isActive) return;
          console.log(
            "⏱️ Performing final verification check before timeout..."
          );

          try {
            // One last refresh attempt
            const { data } = await supabase.auth.refreshSession();

            if (
              data.user?.email_confirmed_at ||
              data.user?.user_metadata?.email_verified
            ) {
              console.log("✅ Email verification detected in final check!");
              setMessage({
                type: "success",
                text: "Email verified successfully! Redirecting...",
              });

              setTimeout(() => {
                if (isActive) router.push("/patient");
              }, 1000);
            } else {
              console.log("❌ Email not verified in the allocated time");
            }
          } catch (error) {
            console.error("Error in final verification check:", error);
          }
        }, (timeLeft - 2) * 1000); // 2 seconds before timeout

        return () => {
          clearInterval(checkInterval);
          clearTimeout(finalCheck);
        };
      } catch (error) {
        console.error("Error setting up verification monitoring:", error);
        setMessage({
          type: "error",
          text: "Something went wrong. Please try refreshing the page.",
        });
      } finally {
        setIsChecking(false);
      }
    };

    setupVerificationMonitoring();

    // Clean up
    return () => {
      console.log("🧹 Cleaning up email verification monitoring...");
      isActive = false;

      if (verificationTimerRef.current) {
        clearInterval(verificationTimerRef.current);
        verificationTimerRef.current = null;
      }

      if (channelRef.current) {
        console.log("🧹 Unsubscribing from realtime updates...");
        unsubscribeFromUsers(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [router, email, userId, timeLeft]);

  // Check initial email confirmation status
  useEffect(() => {
    const checkEmailStatus = async () => {
      if (!email) {
        setIsChecking(false);
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email_confirmed_at) {
          console.log(
            "Email already confirmed! Redirecting to patient dashboard..."
          );
          router.push("/patient");
          return;
        }

        // ADMIN QUERY ATTEMPT: Try to directly access auth.users table for debugging
        try {
          console.log("Attempting to query auth.users table directly...");

          // Attempt to query the users table directly - will only work with proper permissions
          const { data: authUsers, error } = await supabase
            .from("auth.users")
            .select("*")
            .limit(10);

          if (error) {
            console.log("Could not query auth.users directly:", error.message);
          } else {
            console.log(
              "📊 AUTH.USERS TABLE DATA (FIRST 10 RECORDS):",
              authUsers
            );
          }
        } catch (queryError) {
          console.log(
            "Permission denied when trying to access auth.users table:",
            queryError
          );
        }

        // Also try querying just the current user
        try {
          if (user?.id) {
            const { data: userData, error } = await supabase
              .from("auth.users")
              .select("*")
              .eq("id", user.id)
              .single();

            if (error) {
              console.log(
                "Could not query current user from auth.users:",
                error.message
              );
            } else {
              console.log("📊 CURRENT USER DATA FROM AUTH.USERS:", userData);
            }
          }
        } catch (userQueryError) {
          console.log("Error querying current user:", userQueryError);
        }

        setIsChecking(false);
      } catch (error: unknown) {
        console.error("Error checking email status:", error);
        setIsChecking(false);
      }
    };

    checkEmailStatus();
  }, [email, router]);

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      console.log("Manually resending verification email to:", email);
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        if (
          error.message.includes("rate limit") ||
          error.message.includes("security purposes")
        ) {
          setMessage({
            type: "info",
            text: "Please wait a moment before requesting another verification email.",
          });
          setCountdown(60);
        } else {
          console.error("Error manually resending verification email:", error);
          throw error;
        }
      } else {
        console.log("Verification email manually resent successfully");
        setMessage({
          type: "success",
          text: "Verification email sent! Please check your inbox and spam folder.",
        });
        setCountdown(60);

        // Reset timeout timer to give more time
        setTimeLeft(180);
      }
    } catch (error: unknown) {
      console.error("Error in handleResendEmail:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Please check your inbox to confirm your email address"
      authType="login"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start">
          <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Verification email sent to:</p>
            <p className="mt-1 font-mono">{email || "your email address"}</p>
            <p className="mt-2 text-sm">
              Please check your inbox and click the verification link to
              activate your account.
            </p>
            <p className="mt-2 text-xs text-blue-600">
              Time remaining: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {isChecking && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span>Checking email status...</span>
          </div>
        )}

        {message && (
          <div
            className={`${
              message.type === "success"
                ? "bg-green-50 text-green-600"
                : message.type === "error"
                ? "bg-red-50 text-red-500"
                : "bg-blue-50 text-blue-600"
            } p-3 rounded-lg flex items-start`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <Button
            onClick={handleResendEmail}
            className="w-full py-2.5"
            size="lg"
            isLoading={isSubmitting}
            disabled={countdown > 0 || isChecking}
          >
            {countdown > 0
              ? `Resend Email (${countdown}s)`
              : "Resend Verification Email"}
          </Button>

          <Button
            onClick={handleBackToLogin}
            className="w-full py-2.5"
            size="lg"
            variant="outline"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
