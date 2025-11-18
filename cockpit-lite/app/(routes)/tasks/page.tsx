/**
 * Cockpit Tasks Page
 *
 * Displays all tasks, grouped by project.
 * Allows creation of new tasks through the API service layer.
 */

import { api } from "@/services/api";
import type { Task, Project } from "@/lib/types";
import TaskList from "@/components/TaskList";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([
    api.getTasks().catch(() => [] as Task[]),
    api.getProjects().catch(() => [] as Project[]),
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Tasks</h1>

      <TasksClient initialTasks={tasks} projects={projects} />

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>All Tasks</h2>
        <TaskList tasks={tasks} />
      </section>
    </div>
  );
}

