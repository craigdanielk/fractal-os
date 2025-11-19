import { mintTenantToken } from "../../kernel/auth/token";



export async function getAuthHeaders(user: any) {

const token = mintTenantToken(

user.id,

user.tenant_id,

user.role || "user"

);

return {

Authorization: `Bearer ${token}`,

apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

};

}

