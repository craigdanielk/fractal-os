/**
 * Cockpit Tasks Page
 *
 * Displays all tasks, grouped by project.
 * Allows creation of new tasks through the API service layer.
 */

import { Suspense } from "react";
import { api } from "@/services/api";
import type { Task, Project } from "@/lib/types";
import TasksPageClient from "./TasksPageClient";

async function TasksContent() {
  const [tasks, projects] = await Promise.all([
    api.getTasks().catch(() => [] as Task[]),
    api.getProjects().catch(() => [] as Project[]),
  ]);

  return <TasksPageClient initialTasks={tasks} projects={projects} />;
}

export default async function TasksPage() {
  return (
    <div className="glass-card">
      <Suspense fallback={<div className="glass-panel animate-pulse">Loading tasks...</div>}>
        <TasksContent />
      </Suspense>
    </div>
  );
}

