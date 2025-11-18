/**
 * TimeEntryForm Component
 *
 * Deterministic, controlled component for logging time to a task.
 * Uses Cockpit UI primitives and enforces clean numeric input.
 */

"use client";

import type { Task } from "@/lib/types";
import { theme } from "@/ui/theme";

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
  onSubmit,
}: TimeEntryFormProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={theme.headings.h2}>Log Time</h2>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <select
          value={selectedTaskId}
          onChange={(e) => onSelectTask(e.target.value)}
          style={theme.inputs.select}
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
          min="0"
          step="0.25"
          placeholder="Hours"
          value={hours}
          onChange={(e) => onHoursChange(e.target.value)}
          style={theme.inputs.text}
        />

        <button style={theme.buttons.primary} onClick={onSubmit}>
          Add
        </button>
      </div>
    </div>
  );
}

