import { createBrowserClient } from "@supabase/ssr";

// Define a function to create the Supabase client for use in the browser
export function createClient() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Create and return the Supabase client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
