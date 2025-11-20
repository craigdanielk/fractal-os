import { supabase } from './supabase-schema';

export async function getFKOptions(table:string,column:string) {

  const { data: fk } = await supabase.rpc('get_fk_targets',{table_name:table,column_name:column});

  if (!fk) return [];

  const { data } = await supabase.from(fk.target_table).select('*');

  return data ?? [];

}

