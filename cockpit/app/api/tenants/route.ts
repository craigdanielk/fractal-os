import { NextResponse } from "next/server";
import { getCurrentTenant } from "@/lib/auth/tenant";
import { getScopedSupabaseClient } from "@/lib/supabase-client";

export async function GET() {
  try {
    const tenantContext = await getCurrentTenant();
    
    if (!tenantContext) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await getScopedSupabaseClient();
    const accessibleTenantIds = tenantContext.accessibleTenantIds;
    const role = tenantContext.role;

    let tenants: any[] = [];

    // Admin can see all tenants
    if (role === "admin") {
      const { data, error } = await client
        .from("tenants")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) throw error;
      tenants = data || [];
    }
    // Agency can see their tenant + sub-tenants
    else if (role === "agency") {
      const { data, error } = await client
        .from("tenants")
        .select("id, name, slug")
        .in("id", accessibleTenantIds)
        .order("name", { ascending: true });

      if (error) throw error;
      tenants = data || [];
    }
    // Client can only see their own tenant
    else {
      const { data, error } = await client
        .from("tenants")
        .select("id, name, slug")
        .eq("id", tenantContext.tenantId)
        .single();

      if (error) throw error;
      tenants = data ? [data] : [];
    }

    return NextResponse.json({
      tenants,
      currentTenantId: tenantContext.tenantId,
      role: tenantContext.role,
    });
  } catch (error: any) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

