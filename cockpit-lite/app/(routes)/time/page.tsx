/**
 * Cockpit Time Tracking Page
 *
 * Allows users to:
 *  - log hours against tasks/projects
 *  - view all time entries
 *  - feed the Economics Engine with labour data
 */

import { Suspense } from "react";
import { api } from "@/services/api";
import type { Task, TimeEntry } from "@/lib/types";
import TimeClient from "./TimeClient";

async function TimeContent() {
  const [tasks, entries] = await Promise.all([
    api.getTasks().catch(() => [] as Task[]),
    api.getTimeEntries().catch(() => [] as TimeEntry[]),
  ]);

  return <TimeClient initialTasks={tasks} initialEntries={entries} />;
}

export default async function TimePage() {
  return (
    <div className="glass-card">
      <Suspense fallback={<div className="glass-panel animate-pulse">Loading time data...</div>}>
        <TimeContent />
      </Suspense>
    </div>
  );
}

