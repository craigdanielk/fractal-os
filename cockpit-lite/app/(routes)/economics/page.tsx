import { getEconomics } from "@/services/economics";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function EconomicsPage() {
  const econ = await getEconomics();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Economics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {econ.map((e: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={e.id}>
            <div className="font-medium mb-2">{e.title}</div>
            <DynamicFields raw={e.raw} />
          </div>
        ))}
      </div>
    </div>
  );
}
