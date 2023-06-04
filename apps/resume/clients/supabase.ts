import { createClient } from '@supabase/supabase-js';
import { Database } from '@libs/database.types';

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const supabase = createClient<Database>(supabase_url!, anon_key!);

export default supabase;
