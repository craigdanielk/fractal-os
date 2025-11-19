import { getEconomics } from "@/services/economics";
import { getCurrentTenant } from "@/lib/auth/tenant";
import TenantSwitcher from "@/components/TenantSwitcher";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export default async function EconomicsPage() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Not Authenticated</h1>
        <p>Please log in to access economics.</p>
      </div>
    );
  }

  // Only admin and agency can access economics
  if (tenantContext.role === "client") {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Access Denied</h1>
        <p>Economics is only available to administrators and agencies.</p>
      </div>
    );
  }

  const rows = await getEconomics();
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Economics Overview</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="economics" />
          <TenantSwitcher />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((e) => (
          <Link
            href={`/economics/${e.id}`}
            key={e.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition"
          >
            <div className="font-medium mb-2">Economics Model</div>
            <div className="text-sm space-y-1">
              {e.base_rate !== null && <div>Base Rate: ${e.base_rate.toFixed(2)}</div>}
              {e.direct_expenses !== null && <div>Direct Expenses: ${e.direct_expenses.toFixed(2)}</div>}
              {e.margin_target !== null && <div>Margin Target: {e.margin_target.toFixed(2)}%</div>}
              {e.overhead_percent !== null && <div>Overhead: {e.overhead_percent.toFixed(2)}%</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
