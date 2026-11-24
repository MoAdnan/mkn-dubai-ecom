import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://icqovongnsiianjdxdzg.supabase.co";
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key-for-prerendering";

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};
