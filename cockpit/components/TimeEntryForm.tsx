/**
 * TimeEntryForm Component
 *
 * Deterministic, controlled component for logging time to a task.
 * Uses Cockpit UI primitives and enforces clean numeric input.
 */

"use client";

import type { Task } from "@/lib/types";

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
    <div className="glass-card mb-6">
      <h2 className="text-xl font-semibold mb-4">Log Time</h2>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <select
          value={selectedTaskId}
          onChange={(e) => onSelectTask(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm min-w-[200px]"
        >
          <option value="">Select task</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
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
          className="px-3 py-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm w-24"
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onSubmit}
        >
          Add
        </button>
      </div>
    </div>
  );
}

