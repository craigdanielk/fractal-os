

/**
 * TimeEntryForm Component
 *
 * Stateless form for logging time into a selected task.
 * The parent page handles submission and state updates.
 */

import type { Task } from "../../kernel/schemas";

interface TimeEntryFormProps {
  tasks: Task[];
  selectedTaskId: string;
  hours: string;
  onSelectTask: (taskId: string) => void;
  onHoursChange: (hours: string) => void;
  onSubmit: () => void;
}

export default function TimeEntryForm({
  tasks,
  selectedTaskId,
  hours,
  onSelectTask,
  onHoursChange,
  onSubmit
}: TimeEntryFormProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Log Time</h2>

      <select
        value={selectedTaskId}
        onChange={(e) => onSelectTask(e.target.value)}
        style={{ marginRight: "1rem" }}
      >
        <option value="">Select task</option>
        {tasks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Hours"
        value={hours}
        onChange={(e) => onHoursChange(e.target.value)}
        style={{ width: "80px", marginRight: "1rem" }}
      />

      <button onClick={onSubmit}>Add</button>
    </div>
  );
}