import { getEconomics } from "@/services/economics";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EconomicsPage() {
  const rows = await getEconomics();
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Economics Overview</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="economics" />
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
              {e.base_rate !== null && e.base_rate !== undefined && <div>Base Rate: ${e.base_rate.toFixed(2)}</div>}
              {e.direct_expenses !== null && e.direct_expenses !== undefined && <div>Direct Expenses: ${e.direct_expenses.toFixed(2)}</div>}
              {e.margin_targets !== null && e.margin_targets !== undefined && <div>Margin Target: {e.margin_targets.toFixed(2)}%</div>}
              {e.overhead_pct !== null && e.overhead_pct !== undefined && <div>Overhead: {e.overhead_pct.toFixed(2)}%</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
