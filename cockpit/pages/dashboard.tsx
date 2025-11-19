

/**
 * Cockpit Dashboard
 *
 * High‑level operational overview:
 *  - Active projects
 *  - Today’s tasks
 *  - Weekly time summary
 *  - Contribution snapshots (if economics enabled)
 */

import { useEffect, useState } from "react";
import { getProjects, getTasks, getEconomicsOverview } from "../services/api";
import type { Project, Task } from "../../kernel/schemas";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [economics, setEconomics] = useState<any>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
    getTasks().then(setTasks).catch(console.error);

    getEconomicsOverview()
      .then(setEconomics)
      .catch(() => setEconomics(null));
  }, []);

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
        <h2 style={{ marginBottom: "0.75rem" }}>Today’s Tasks</h2>
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