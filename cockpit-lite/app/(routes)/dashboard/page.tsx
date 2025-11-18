/**
 * Cockpit Dashboard
 *
 * High‑level operational overview:
 *  - Active projects
 *  - Today's tasks
 *  - Weekly time summary
 *  - Contribution snapshots (if economics enabled)
 */

import { Suspense } from "react";
import { api } from "@/services/api";
import type { Project, Task, EconomicsOverview } from "@/lib/types";
import MiniGantt from "@/components/MiniGantt";

async function ProjectsSection() {
  const projects = await api.getProjects().catch(() => [] as Project[]);
  
  return (
    <div className="glass-card">
      <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <ul className="list-none p-0 space-y-2">
          {projects.map((p) => (
            <li key={p.id} className="p-2 border-b border-white/20 last:border-0">
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function TasksSection() {
  const tasks = await api.getTasks().catch(() => [] as Task[]);
  
  return (
    <div className="glass-card">
      <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks for today.</p>
      ) : (
        <ul className="list-none p-0 space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="p-2 border-b border-white/20 last:border-0">
              {t.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function EconomicsSection() {
  const economics = await api.getEconomicsOverview().catch(() => null);
  
  return (
    <div className="glass-card">
      <h2 className="text-xl font-semibold mb-4">Economics Snapshot</h2>
      {economics ? (
        <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm font-mono text-sm">
          <pre className="m-0">
            {`Revenue: ${economics.revenue}
Labour Cost: ${economics.labourCost}
Contribution: ${economics.contribution}
Margin: ${economics.margin.toFixed(1)}%`}
          </pre>
        </div>
      ) : (
        <p className="text-gray-500">Economics disabled or unavailable.</p>
      )}
    </div>
  );
}

async function GanttSection() {
  const tasks = await api.getTasks().catch(() => [] as Task[]);
  
  return (
    <div className="glass-card">
      <MiniGantt tasks={tasks} />
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="glass-card">
      <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-6">FractalOS Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<div className="glass-card animate-pulse h-32"></div>}>
              <ProjectsSection />
            </Suspense>

            <Suspense fallback={<div className="glass-card animate-pulse h-32"></div>}>
              <TasksSection />
            </Suspense>

            <Suspense fallback={<div className="glass-card animate-pulse h-32"></div>}>
              <EconomicsSection />
            </Suspense>
          </div>

          <Suspense fallback={<div className="glass-card animate-pulse h-64"></div>}>
            <GanttSection />
          </Suspense>
        </div>
    </div>
  );
}

