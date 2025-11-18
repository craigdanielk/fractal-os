/**
 * Cockpit Time Tracking Page
 *
 * Allows users to:
 *  - log hours against tasks/projects
 *  - view all time entries
 *  - feed the Economics Engine with labour data
 */

import { api } from "../../../services/api";
import type { Task, TimeEntry } from "../../../lib/types";
import TimeClient from "./TimeClient";

export default async function TimePage() {
  const [tasks, entries] = await Promise.all([
    api.getTasks().catch(() => [] as Task[]),
    api.getTimeEntries().catch(() => [] as TimeEntry[]),
  ]);

  return <TimeClient initialTasks={tasks} initialEntries={entries} />;
}

