"use client";

import { useState } from "react";
import { logTimeAction, getTimeEntriesAction } from "@/app/actions";
import type { Task, TimeEntry } from "@/lib/types";
import TimeEntryForm from "@/components/TimeEntryForm";
import TimeTracker from "@/components/TimeTracker";

interface TimeClientProps {
  initialTasks: Task[];
  initialEntries: TimeEntry[];
}

export default function TimeClient({
  initialTasks,
  initialEntries,
}: TimeClientProps) {
  const [tasks] = useState<Task[]>(initialTasks);
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [hours, setHours] = useState("");

  const handleLogTime = async () => {
    if (!selectedTaskId || !hours) return;

    try {
      const newEntry = await logTimeAction({
        taskId: selectedTaskId,
        hours: parseFloat(hours),
      });

      setEntries((prev) => [...prev, newEntry]);
      setHours("");
      setSelectedTaskId("");
    } catch (error) {
      console.error("Failed to log time:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      const newEntries = await getTimeEntriesAction();
      setEntries(newEntries);
    } catch (error) {
      console.error("Failed to refresh entries:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Time Tracking</h1>

      <TimeTracker tasks={tasks} onTimeLogged={handleRefresh} />

      <TimeEntryForm
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        hours={hours}
        onSelectTask={setSelectedTaskId}
        onHoursChange={setHours}
        onSubmit={handleLogTime}
      />

      <section className="glass-card">
        <h2 className="text-xl font-semibold mb-4">Time Entries</h2>

        {entries.length === 0 ? (
          <p className="text-gray-500">No time entries logged.</p>
        ) : (
          <ul className="list-none p-0 space-y-2">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center p-2 border-b border-white/20 last:border-0"
              >
                <span className="font-medium">
                  {e.task?.name || "Unknown Task"}
                </span>
                <span className="text-gray-600 dark:text-gray-400">{e.duration_hours?.toFixed(2) || "0.00"} hours</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

