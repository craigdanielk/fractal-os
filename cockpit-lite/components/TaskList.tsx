/**
 * TaskList Component
 *
 * Enhanced UI component with inline status editing.
 * The Cockpit passes the tasks into this component.
 */

"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export default function TaskList({ tasks, onStatusChange }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks available.</p>;
  }

  const statusOptions: Task["status"][] = ["open", "in_progress", "blocked", "completed"];

  return (
    <div className="glass-card">
      <ul className="list-none m-0 p-0 space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between p-3 border-b border-white/20 last:border-0"
          >
            <div className="flex-1">
              <div className="font-semibold text-base">{t.name}</div>
              {editingId === t.id ? (
                <select
                  value={t.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Task["status"];
                    onStatusChange?.(t.id, newStatus);
                    setEditingId(null);
                  }}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="mt-1 px-2 py-1 text-sm rounded border border-white/30 bg-white/20 backdrop-blur-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setEditingId(t.id)}
                >
                  Status: <span className="capitalize">{t.status.replace("_", " ")}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
