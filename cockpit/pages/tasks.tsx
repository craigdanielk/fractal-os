/****
 * Cockpit Tasks Page
 *
 * Displays all tasks, grouped by project.
 * Allows creation of new tasks through the API service layer.
 */

import { useEffect, useState } from "react";
import { getTasks, getProjects, createTask } from "../services/api";
import type { Task, Project } from "../../kernel/schemas";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>("");

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const handleCreateTask = async () => {
    if (!newTaskName || !newTaskProjectId) return;

    const newTask = await createTask({
      name: newTaskName,
      projectId: newTaskProjectId
    });

    setTasks((prev) => [...prev, newTask]);
    setNewTaskName("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Tasks</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Create Task</h2>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            placeholder="Task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />

          <select
            value={newTaskProjectId}
            onChange={(e) => setNewTaskProjectId(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateTask}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: "#000",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add Task
          </button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: "0.75rem" }}>All Tasks</h2>

        {tasks.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No tasks found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>
                  Status: {t.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}