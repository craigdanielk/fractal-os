

/**
 * TaskList Component
 *
 * Stateless UI component for rendering a list of tasks.
 * The Cockpit passes the tasks into this component.
 */

import type { Task } from "../../kernel/schemas";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
    <ul style={{ paddingLeft: "1rem" }}>
      {tasks.map((t) => (
        <li key={t.id} style={{ marginBottom: "0.5rem" }}>
          <strong>{t.name}</strong>{" "}
          <span style={{ opacity: 0.6 }}>({t.status})</span>
        </li>
      ))}
    </ul>
  );
}