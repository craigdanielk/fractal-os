"use client";

import { useState } from "react";
import { createTask } from "@/services/tasks";
import type { Task, Project } from "@/lib/types";

interface TasksClientProps {
  initialTasks: Task[];
  projects: Project[];
}

export default function TasksClient({
  initialTasks,
  projects,
}: TasksClientProps) {
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>("");

  const handleCreateTask = async () => {
    if (!newTaskName || !newTaskProjectId) return;

    try {
      await createTask({
        name: newTaskName,
        project_id: newTaskProjectId,
      });

      // Refresh the page to show new task
      window.location.reload();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <section className="glass-card mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Task</h2>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm flex-1 min-w-[200px]"
        />

        <select
          value={newTaskProjectId}
          onChange={(e) => setNewTaskProjectId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm min-w-[200px]"
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleCreateTask}
        >
          Add Task
        </button>
      </div>
    </section>
  );
}

