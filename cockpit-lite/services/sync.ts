import { supabase } from '../lib/supabase-schema';

export async function pull(table:string) {

  const { data, error } = await supabase.from(table).select('*');

  if (error) throw error;

  return data;

}

export async function push(table:string, payload:any) {

  const { data, error } = await supabase.from(table).insert(payload).select();

  if (error) throw error;

  return data;

}

