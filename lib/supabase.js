import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vumxsdfpzfxrgdsmwaai.supabase.co";
const supabaseKey = "sb_publishable_iVApcNrFmXcWEFUc1PWy9w_9c2JEsiy";

export const supabase = createClient(supabaseUrl, supabaseKey);
