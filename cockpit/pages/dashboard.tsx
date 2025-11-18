

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
      <h1>FractalOS Dashboard</h1>

      <section>
        <h2>Active Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Today’s Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks for today.</p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Economics Snapshot</h2>
        {economics ? (
          <pre>{JSON.stringify(economics, null, 2)}</pre>
        ) : (
          <p>Economics disabled or unavailable.</p>
        )}
      </section>
    </div>
  );
}