/**
 * EconomicsCharts Component
 *
 * Displays contribution and cost summaries in a simple visual format.
 * This is intentionally lightweight for the Lite Cockpit.
 */

"use client";

import { useEffect } from "react";
import { theme } from "@/ui/theme";
import { subscribe } from "@/lib/realtime";

interface EconomicsData {
  revenue: number;
  labourCost: number;
  overheadCost: number;
  directExpenses: number;
  totalCost: number;
  contribution: number;
  margin: number;
}

interface EconomicsChartsProps {
  data: EconomicsData | null;
  onRefresh?: () => void;
}

export default function EconomicsCharts({ data, onRefresh }: EconomicsChartsProps) {
  useEffect(() => {
    const unsub = subscribe("economics_model", () => {
      onRefresh?.();
    });
    return () => {
      if (unsub?.unsubscribe) unsub.unsubscribe();
    };
  }, [onRefresh]);

  if (!data) {
    return <p>No economics data available.</p>;
  }

  return (
    <div className="glass-card">
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Economics Breakdown</h2>
      </section>

      <ul className="leading-relaxed list-none p-0 space-y-2">
        <li>
          <strong>Revenue:</strong> R{data.revenue.toFixed(2)}
        </li>
        <li>
          <strong>Labour Cost:</strong> R{data.labourCost.toFixed(2)}
        </li>
        <li>
          <strong>Overhead Cost:</strong> R{data.overheadCost.toFixed(2)}
        </li>
        <li>
          <strong>Direct Expenses:</strong> R{data.directExpenses.toFixed(2)}
        </li>
        <li>
          <strong>Total Cost:</strong> R{data.totalCost.toFixed(2)}
        </li>
        <li>
          <strong>Contribution:</strong> R{data.contribution.toFixed(2)}
        </li>
        <li>
          <strong>Margin:</strong> {(data.margin * 100).toFixed(1)}%
        </li>
      </ul>
    </div>
  );
}

