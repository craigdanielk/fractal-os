import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";



export function middleware(req: NextRequest) {

const url = req.nextUrl;

const tenant = req.cookies.get("tenant_id")?.value;



// Default tenant fallback

if (!tenant) {

const res = NextResponse.next();

res.cookies.set("tenant_id", "fractal-root", { path: "/" });

return res;

}



// Tenant-Namespace Routing Example: /t/[tenant]/dashboard

if (url.pathname.startsWith("/t/")) {

const segTenant = url.pathname.split("/")[2];

if (segTenant !== tenant) {

url.pathname = `/t/${tenant}/dashboard`;

return NextResponse.redirect(url);

}

}



return NextResponse.next();

}



export const config = {

matcher: ["/t/:path*"]

};

