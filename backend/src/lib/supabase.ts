import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Null when env vars absent — callers must guard with `if (supabase)`
export const supabase = url && key ? createClient(url, key) : null;
