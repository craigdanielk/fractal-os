/**
 * TaskList Component
 *
 * Enhanced UI component with inline status editing.
 * The Cockpit passes the tasks into this component.
 */

"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/lib/types";
import { subscribe } from "@/lib/realtime";

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export default function TaskList({ tasks, onStatusChange }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsub = subscribe("tasks", () => {
      setRefreshKey((prev) => prev + 1);
    });
    return () => {
      if (unsub?.unsubscribe) unsub.unsubscribe();
    };
  }, []);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks available.</p>;
  }

  const statusOptions: Task["status"][] = ["not_started", "in_progress", "completed", "cancelled"];

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold">{t.name}</div>
          <div className="text-white/60 text-sm">{t.status}</div>
        </div>
      ))}
    </div>
  );
}
