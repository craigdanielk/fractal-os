import { NextResponse } from "next/server";



export async function GET() {

// mock session until supabase migration

return NextResponse.json({

user: {

id: "local-dev",

tenant_id: "fractal-root",

role: "root"

}

});

}

