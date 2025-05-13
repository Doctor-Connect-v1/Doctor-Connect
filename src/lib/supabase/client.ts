import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define a function to create the Supabase client for use in the browser
export function createClient() {
  return createClientComponentClient();
}
