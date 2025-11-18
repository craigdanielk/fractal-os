"use client";

import { useState } from "react";
import { api } from "../../../../services/api";
import type { Task, Project } from "../../../../lib/types";
import { theme } from "../../../../ui/theme";

interface TasksClientProps {
  initialTasks: Task[];
  projects: Project[];
}

export default function TasksClient({
  initialTasks,
  projects,
}: TasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>("");

  const handleCreateTask = async () => {
    if (!newTaskName || !newTaskProjectId) return;

    try {
      const created = await api.createTask({
        name: newTaskName,
        projectId: newTaskProjectId,
      });

      setTasks((prev) => [...prev, created]);
      setNewTaskName("");
      setNewTaskProjectId("");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginBottom: "0.75rem" }}>Create Task</h2>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          style={theme.inputs.text}
        />

        <select
          value={newTaskProjectId}
          onChange={(e) => setNewTaskProjectId(e.target.value)}
          style={theme.inputs.select}
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button style={theme.buttons.primary} onClick={handleCreateTask}>
          Add Task
        </button>
      </div>
    </section>
  );
}

