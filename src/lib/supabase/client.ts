import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oewybbmpooveeopcumav.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ld3liYm1wb292ZWVvcGN1bWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwODk4MzEsImV4cCI6MjEwNjY2NTgzMX0.dgrpBLbPSv4EvEZ3A-tnCwog2cF2tcF6iBSkFtukfDI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
