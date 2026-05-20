import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// ─── Public Client (anon key) ─────────────────────────────────────────────────
export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);

// ─── Admin Client (service role key — server-side only) ───────────────────────
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
