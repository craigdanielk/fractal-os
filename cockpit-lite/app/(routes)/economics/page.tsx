import { getEconomics } from "@/services/economics";

export default async function EconomicsPage() {
  const econ = await getEconomics();
  const model = econ[0] || {
    revenue: 0,
    labour: 0,
    overhead: 0,
    direct: 0,
    margin: 0,
  };

  return (
    <main className="p-10 flex justify-center min-h-screen">
      <div className="glass-card w-[700px] p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Economics Overview</h1>

        <p>Revenue: {model.revenue}</p>
        <p>Labour Cost: {model.labour}</p>
        <p>Overhead %: {model.overhead}</p>
        <p>Direct Expenses: {model.direct}</p>
        <p>Margin Targets: {model.margin}%</p>
      </div>
    </main>
  );
}
