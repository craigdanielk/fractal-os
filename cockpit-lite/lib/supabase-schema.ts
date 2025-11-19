import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

);

export async function getTables() {

  const { data, error } = await supabase

    .from('information_schema.columns')

    .select('table_name')

    .eq('table_schema','public');

  if (error) throw error;

  return [...new Set(data.map((r:any)=>r.table_name))];

}

export async function getTableSchema(table: string) {

  const { data, error } = await supabase

    .from('information_schema.columns')

    .select('*')

    .eq('table_schema','public')

    .eq('table_name', table);

  if (error) throw error;

  return data;

}

