"use client";

import { useState } from "react";
import { api } from "@/services/api";
import type { Task, TimeEntry } from "@/lib/types";
import TimeEntryForm from "@/components/TimeEntryForm";
import { theme } from "@/ui/theme";

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

    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;

    try {
      const newEntry = await api.logTime({
        taskId: selectedTaskId,
        projectId: task.projectId,
        hours: parseFloat(hours),
      });

      setEntries((prev) => [...prev, newEntry]);
      setHours("");
      setSelectedTaskId("");
    } catch (error) {
      console.error("Failed to log time:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Time Tracking</h1>

      <TimeEntryForm
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        hours={hours}
        onSelectTask={setSelectedTaskId}
        onHoursChange={setHours}
        onSubmit={handleLogTime}
      />

      <section>
        <h2 style={{ marginBottom: "0.75rem" }}>Time Entries</h2>

        {entries.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No time entries logged.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {entries.map((e) => (
              <li
                key={e.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <strong>
                  {tasks.find((t) => t.id === e.taskId)?.name || "Unknown Task"}
                </strong>{" "}
                — {e.hours} hours
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

