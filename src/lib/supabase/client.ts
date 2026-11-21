import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://icqovongnsiianjdxdzg.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key-for-prerendering";

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};
