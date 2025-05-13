import { createClient } from "@/lib/supabase/client";

// Type for the Next.js router that includes the push method
interface RouterWithPush {
  push: (url: string) => void;
}

/**
 * Check if the current authenticated user has the doctor role
 * @returns Promise<boolean> True if user is a doctor, false otherwise
 */
export async function isUserDoctor(): Promise<boolean> {
  try {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // Query the profiles table to check the user's role
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }

    // Check if the user has the doctor role
    return data?.role === "doctor";
  } catch (error) {
    console.error("Error verifying doctor role:", error);
    return false;
  }
}

/**
 * Navigate user based on their role after checking doctor status
 */
export async function handleDoctorRedirect(
  router: RouterWithPush
): Promise<void> {
  try {
    const isDoctor = await isUserDoctor();

    if (isDoctor) {
      // User is a doctor, redirect to doctor dashboard
      router.push("/doctor");
    } else {
      // User is not a doctor, redirect to doctor registration page
      router.push("/doctor-registration");
    }
  } catch (error) {
    console.error("Error handling doctor redirect:", error);
    // Fallback to doctor registration page on error
    router.push("/doctor-registration");
  }
}
