import jwt from "jsonwebtoken";



export function mintTenantToken(userId: string, tenantId: string, role: string) {

const secret = process.env.SUPABASE_JWT_SECRET!;

return jwt.sign(

{

sub: userId,

tenant_id: tenantId,

role: role,

aud: "authenticated",

},

secret,

{ expiresIn: "12h" }

);

}

