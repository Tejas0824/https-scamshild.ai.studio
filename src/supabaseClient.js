import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ktacvnevghkhdjiwgtkw.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_PXITNh7m6R7JyAgcY6tSIA_z4DxGwpF";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
