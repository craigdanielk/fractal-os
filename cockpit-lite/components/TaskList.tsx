/**
 * TaskList Component
 *
 * Stateless UI component for rendering a list of tasks.
 * The Cockpit passes the tasks into this component.
 */

import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        padding: "1rem",
        background: "white",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              padding: "0.5rem 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div style={{ fontWeight: 600 }}>{t.name}</div>
            <div style={{ opacity: 0.6, fontSize: "0.85rem" }}>
              Status: {t.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

