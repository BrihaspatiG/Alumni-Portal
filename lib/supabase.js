import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oclckiumprfqesznipus.supabase.co";
const supabaseKey = "sb_publishable_V56BvaVvngraLKqkyl0hhg_pCtnByhf";

export const supabase = createClient(supabaseUrl, supabaseKey);
