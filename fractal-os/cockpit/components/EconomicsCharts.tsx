

/**
 * EconomicsCharts Component
 *
 * Displays contribution and cost summaries in a simple visual format.
 * This is intentionally lightweight for the Lite Cockpit.
 */

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
    <div style={{ marginTop: "2rem" }}>
      <h2>Economics Breakdown</h2>

      <ul style={{ lineHeight: "1.6" }}>
        <li>Revenue: R{data.revenue.toFixed(2)}</li>
        <li>Labour Cost: R{data.labourCost.toFixed(2)}</li>
        <li>Overhead Cost: R{data.overheadCost.toFixed(2)}</li>
        <li>Direct Expenses: R{data.directExpenses.toFixed(2)}</li>
        <li>Total Cost: R{data.totalCost.toFixed(2)}</li>
        <li>Contribution: R{data.contribution.toFixed(2)}</li>
        <li>
          Margin: {(data.margin * 100).toFixed(1)}
          %
        </li>
      </ul>
    </div>
  );
}