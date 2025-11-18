

/**
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
      <h1>Tasks</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Create Task</h2>

        <input
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

        <select
          value={newTaskProjectId}
          onChange={(e) => setNewTaskProjectId(e.target.value)}
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreateTask} style={{ marginLeft: "1rem" }}>
          Add Task
        </button>
      </section>

      <section>
        <h2>All Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>
                {t.name} <span style={{ opacity: 0.6 }}>({t.status})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}