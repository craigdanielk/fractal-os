/**
 * Cockpit Economics Page
 *
 * Presents system-wide and aggregated contribution metrics.
 * Pulls from the deterministic Economics Engine.
 */

import { Suspense } from "react";
import { api } from "@/services/api";
import type { EconomicsOverview } from "@/lib/types";
import EconomicsCharts from "@/components/EconomicsCharts";

async function EconomicsContent() {
  const econ = await api.getEconomicsOverview().catch(() => null);

  if (!econ) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-4">Economics Overview</h1>
        <p className="text-gray-500">Economics disabled or unavailable.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Economics Overview</h1>

      <div className="glass-card">
        <h2 className="text-xl font-semibold mb-4">System Summary</h2>
        <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm font-mono text-sm whitespace-pre-wrap">
          {`Revenue: ${econ.revenue}
Labour Cost: ${econ.labourCost}
Overhead Cost: ${econ.overheadCost}
Direct Expenses: ${econ.directExpenses}
Total Cost: ${econ.totalCost}
Contribution: ${econ.contribution}
Margin: ${econ.margin.toFixed(1)}%`}
        </div>
      </div>

      <EconomicsCharts data={econ} />

      <div className="glass-card">
        <h2 className="text-xl font-semibold mb-4">Raw Economics Object</h2>
        <pre className="p-4 rounded-lg bg-white/10 backdrop-blur-sm overflow-x-auto text-sm">
          {JSON.stringify(econ, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default async function EconomicsPage() {
  return (
    <div className="glass-card">
      <Suspense fallback={<div className="glass-panel animate-pulse">Loading economics...</div>}>
        <EconomicsContent />
      </Suspense>
    </div>
  );
}

