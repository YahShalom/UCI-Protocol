import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// The Supabase client expects a fetch implementation that matches the browser's
// global fetch. `node-fetch` is a ponyfill that provides a similar API. By
// casting it to `typeof global.fetch`, we satisfy the type checker.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    global: {
      fetch: fetch as unknown as typeof global.fetch,
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
