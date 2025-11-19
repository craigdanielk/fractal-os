/****
 * Cockpit Economics Page
 *
 * Presents system-wide and aggregated contribution metrics.
 * Pulls from the deterministic Economics Engine.
 */

import { useEffect, useState } from "react";
import { getEconomicsOverview } from "../services/api";
import { theme } from "../ui/theme";

export default function EconomicsPage() {
  const [econ, setEcon] = useState<any>(null);

  useEffect(() => {
    getEconomicsOverview()
      .then(setEcon)
      .catch(() => setEcon(null));
  }, []);

  if (!econ) {
    return (
      <div style={{ padding: theme.spacing.lg }}>
        <h1 style={theme.headings.h1}>Economics Overview</h1>
        <p style={{ opacity: 0.6 }}>Economics disabled or unavailable.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: theme.spacing.lg }}>
      <h1 style={theme.headings.h1}>Economics Overview</h1>

      <section style={{ marginBottom: theme.spacing.xl }}>
        <h2 style={theme.headings.h2}>System Summary</h2>
        <div
          style={{
            padding: "1rem",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "6px",
            background: theme.colors.surface,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            fontSize: "0.9rem"
          }}
        >
          Revenue: {econ.revenue}
          {"\n"}Labour Cost: {econ.labourCost}
          {"\n"}Overhead Cost: {econ.overheadCost}
          {"\n"}Direct Expenses: {econ.directExpenses}
          {"\n"}Total Cost: {econ.totalCost}
          {"\n"}Contribution: {econ.contribution}
          {"\n"}Margin: {econ.margin}%
        </div>
      </section>

      <section>
        <h2 style={theme.headings.h2}>Raw Economics Object</h2>
        <pre
          style={{
            padding: "1rem",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "6px",
            background: theme.colors.surface,
            overflowX: "auto",
            fontSize: "0.85rem"
          }}
        >
          {JSON.stringify(econ, null, 2)}
        </pre>
      </section>
    </div>
  );
}