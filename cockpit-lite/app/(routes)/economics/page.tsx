import { getEconomics } from "@/services/economics";
import { CURRENT_TENANT } from "@/lib/tenant";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function EconomicsPage() {
  const rows = await getEconomics(CURRENT_TENANT);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Economics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((e: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={e.id}>
            <div className="font-medium mb-2">Economics Model</div>
            <div className="text-sm space-y-1">
              {e.base_rate !== null && <div>Base Rate: {e.base_rate}</div>}
              {e.direct_expenses !== null && <div>Direct Expenses: {e.direct_expenses}</div>}
              {e.margin_target !== null && <div>Margin Target: {e.margin_target}</div>}
              {e.overhead_percent !== null && <div>Overhead: {e.overhead_percent}%</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
