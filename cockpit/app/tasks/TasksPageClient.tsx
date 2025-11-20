"use client";

import { useState } from "react";
import type { Task, Project } from "@/lib/types";
import TaskList from "@/components/TaskList";
import TasksClient from "./TasksClient";

interface TasksPageClientProps {
  initialTasks: Task[];
  projects: Project[];
}

export default function TasksPageClient({
  initialTasks,
  projects,
}: TasksPageClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    // Note: In a real implementation, you'd call an API to update the status
    // For now, we're just updating local state
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      <TasksClient initialTasks={tasks} projects={projects} />

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
        <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
      </section>
    </>
  );
}
