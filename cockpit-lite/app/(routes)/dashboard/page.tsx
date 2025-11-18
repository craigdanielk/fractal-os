/**
 * Cockpit Dashboard
 *
 * High‑level operational overview:
 *  - Active projects
 *  - Today's tasks
 *  - Weekly time summary
 *  - Contribution snapshots (if economics enabled)
 */

import { api } from "@/services/api";
import type { Project, Task, EconomicsOverview } from "@/lib/types";

export default async function DashboardPage() {
  const [projects, tasks, economics] = await Promise.all([
    api.getProjects().catch(() => [] as Project[]),
    api.getTasks().catch(() => [] as Task[]),
    api.getEconomicsOverview().catch(() => null as EconomicsOverview | null),
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>FractalOS Dashboard</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Active Projects</h2>
        {projects.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No projects found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Today's Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No tasks for today.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: "0.75rem" }}>Economics Snapshot</h2>
        {economics ? (
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e5e5e5",
              borderRadius: "6px",
              background: "#fafafa",
              fontSize: "0.9rem",
            }}
          >
            <pre style={{ margin: 0 }}>
              {`Revenue: ${economics.revenue}
Labour Cost: ${economics.labourCost}
Contribution: ${economics.contribution}
Margin: ${economics.margin}%`}
            </pre>
          </div>
        ) : (
          <p style={{ opacity: 0.6 }}>Economics disabled or unavailable.</p>
        )}
      </section>
    </div>
  );
}

