import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kuwgpgrspbcbaetldepn.supabase.co"
).trim();
const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1d2dwZ3JzcGJjYmFldGxkZXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MDExNDksImV4cCI6MjEwNjM3NzE0OX0.ztMzdC679a4CqQVImV3Q0tozAm01Bz27R_JMEjabQSs"
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
