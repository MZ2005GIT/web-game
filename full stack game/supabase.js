import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ujkpsvfbcnptpfpnnulc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Jr6-KMDOVCT83EuwdzmaPw_RanyhXAf";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);