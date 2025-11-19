import { mintTenantToken } from "./token";



export async function loginUser(user: any) {

return {

token: mintTenantToken(

user.id,

user.tenant_id,

user.role || "user"

),

user,

};

}

