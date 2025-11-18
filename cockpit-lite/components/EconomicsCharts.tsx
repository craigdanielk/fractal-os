/**
 * EconomicsCharts Component
 *
 * Displays contribution and cost summaries in a simple visual format.
 * This is intentionally lightweight for the Lite Cockpit.
 */

import { theme } from "@/ui/theme";

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
}

export default function EconomicsCharts({ data }: EconomicsChartsProps) {
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

