/* eslint-disable @typescript-eslint/no-explicit-any */
import { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "./client";

// Define types for user metadata structure
export interface UserMetadata {
  email?: string;
  sub?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  [key: string]: unknown;
}

// Connection status type
type ChannelStatus = "SUBSCRIBED" | "CHANNEL_ERROR" | "TIMED_OUT" | string;

// Custom interface for our channel with metadata
interface VerificationChannel extends RealtimeChannel {
  metadata?: {
    verificationInterval?: NodeJS.Timeout;
    userDataInterval?: NodeJS.Timeout;
  };
}

// Global reference to the active channel
let activeChannel: VerificationChannel | null = null;
const channelName =
  "verification_channel_" + Math.random().toString(36).substring(2, 9);

/**
 * Subscribe to user changes in the database - using the session refresh approach
 * which doesn't require realtime permissions on auth.users table
 */
export function subscribeToUsers(
  callback: (payload: any) => void
): RealtimeChannel {
  // If we already have an active channel, use that
  if (activeChannel) {
    console.log("Using existing subscription", channelName);
    return activeChannel;
  }

  // Otherwise create a new one
  console.log("Setting up new verification channel...", channelName);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const supabase = createClient();

  // Create a channel for heartbeat checking
  const channel = supabase.channel(channelName) as VerificationChannel;

  channel
    .on("presence", { event: "sync" }, () => {
      console.log("Channel presence sync");
    })
    .subscribe((status: ChannelStatus) => {
      console.log("Channel connection status:", status);

      if (status === "SUBSCRIBED") {
        console.log("✅ Successfully subscribed");

        // Start polling for authentication status when connection is established
        let lastCheckedAt: string | null = null;

        const checkVerification = async () => {
          try {
            // Get fresh session info
            const { data } = await supabase.auth.refreshSession();
            const user = data.user;

            if (!user) {
              console.log("No user found in session");
              return;
            }

            // Only log if something changed
            const confirmedAt = user.email_confirmed_at || null;
            if (confirmedAt !== lastCheckedAt) {
              console.log("User verification state:", {
                id: user.id,
                email: user.email,
                confirmed_at: confirmedAt,
                is_verified: !!confirmedAt,
              });

              lastCheckedAt = confirmedAt;
            }

            // If verified, send notification
            if (confirmedAt) {
              callback({
                eventType: "UPDATE",
                schema: "auth",
                table: "users",
                record: {
                  id: user.id,
                  email_confirmed_at: confirmedAt,
                  user_metadata: user.user_metadata,
                },
              });
            }
          } catch (error) {
            console.error("Error checking verification:", error);
          }
        };

        // Fetch complete user data from auth.users
        const fetchCompleteUserData = async () => {
          try {
            // Get current user session
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData.session?.user;

            if (!user) {
              console.log("No user in session for detailed data fetch");
              return;
            }

            console.log("📊 COMPLETE USER DATA FROM SESSION:", {
              id: user.id,
              email: user.email,
              phone: user.phone,
              app_metadata: user.app_metadata,
              user_metadata: user.user_metadata,
              aud: user.aud,
              created_at: user.created_at,
              confirmed_at: user.email_confirmed_at,
              last_sign_in_at: user.last_sign_in_at,
              role: user.role,
              updated_at: user.updated_at,
            });

            // Using the admin query to get full user data including all fields
            // This won't work unless the user has the right permissions, but it's worth trying
            try {
              const { data: userData, error } = await supabase
                .from("auth.users")
                .select("*")
                .eq("id", user.id)
                .single();

              if (error) {
                console.log(
                  "Could not access auth.users directly:",
                  error.message
                );
              } else {
                console.log(
                  "📊 COMPLETE USER DATA FROM AUTH.USERS TABLE:",
                  userData
                );
              }
            } catch (error) {
              console.log(
                "Permission denied for direct auth.users access:",
                error
              );
            }
          } catch (error) {
            console.error("Error fetching complete user data:", error);
          }
        };

        // Check immediately
        checkVerification();
        fetchCompleteUserData();

        // Set up intervals
        const verificationInterval = setInterval(checkVerification, 3000);
        const userDataInterval = setInterval(fetchCompleteUserData, 10000);

        // Store the interval IDs in the channel's metadata to clean up later
        channel.metadata = {
          verificationInterval,
          userDataInterval,
        };
      } else if (status === "CHANNEL_ERROR") {
        console.error("❌ Error with channel");
      } else if (status === "TIMED_OUT") {
        console.error("❌ Subscription timed out");
      }
    });

  // Store a reference to the active channel
  activeChannel = channel;

  return channel;
}

/**
 * Unsubscribe from user changes in the database
 */
export function unsubscribeFromUsers(channel: RealtimeChannel): void {
  if (!channel) return;

  console.log("Unsubscribing from verification channel...");

  try {
    // Clear any intervals
    const verificationChannel = channel as VerificationChannel;
    if (verificationChannel.metadata?.verificationInterval) {
      clearInterval(verificationChannel.metadata.verificationInterval);
    }
    if (verificationChannel.metadata?.userDataInterval) {
      clearInterval(verificationChannel.metadata.userDataInterval);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const supabase = createClient();
    supabase.removeChannel(channel);

    // If this was our active channel, clear the reference
    if (activeChannel === channel) {
      activeChannel = null;
      console.log("Cleared active channel reference");
    }
  } catch (error) {
    console.error("Error unsubscribing from channel:", error);
  }
}
