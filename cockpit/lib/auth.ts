export async function getAuthHeaders(user: any) {
  return {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}
