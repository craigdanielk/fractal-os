import { supabase } from '../lib/supabase-schema';

export async function listClients() {

  const { data, error } = await supabase.from('clients').select('*');

  if (error) throw error;

  return data;

}

export async function createClient(payload:any) {

  const { data, error } = await supabase.from('clients').insert(payload).select();

  if (error) throw error;

  return data;

}

