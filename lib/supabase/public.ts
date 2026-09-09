import { createClient } from "@supabase/supabase-js";

export function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) throw new Error("Missing Supabase public environment variables.");
  return createClient(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
