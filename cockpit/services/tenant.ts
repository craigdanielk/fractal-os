import { cookies } from "next/headers";



export function tenantContext() {

const t = cookies().get("tenant_id")?.value;

return t || null;

}



export const withTenant = (payload: any) => ({

...payload,

tenant_id: tenantContext(),

});

