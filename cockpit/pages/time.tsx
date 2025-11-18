

/**
 * Cockpit Time Tracking Page
 *
 * Allows users to:
 *  - log hours against tasks/projects
 *  - view all time entries
 *  - feed the Economics Engine with labour data
 */

import { useEffect, useState } from "react";
import { getTasks, getTimeEntries, logTime } from "../services/api";
import type { Task, TimeEntry } from "../../kernel/schemas";

export default function TimePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
    getTimeEntries().then(setEntries).catch(console.error);
  }, []);

  const handleLogTime = async () => {
    if (!selectedTaskId || !hours) return;

    const newEntry = await logTime({
      taskId: selectedTaskId,
      projectId: tasks.find((t) => t.id === selectedTaskId)?.projectId || "",
      hours: parseFloat(hours)
    });

    setEntries((prev) => [...prev, newEntry]);
    setHours("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Time Tracking</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Log Time</h2>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              minWidth: "200px"
            }}
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
            min="0"
            step="0.25"
            onChange={(e) => setHours(e.target.value)}
            style={{
              padding: "0.5rem",
              width: "100px",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />

          <button
            onClick={handleLogTime}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: "#000",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
      </section>

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
                  borderBottom: "1px solid #f0f0f0"
                }}
              >
                <strong>{tasks.find((t) => t.id === e.taskId)?.name}</strong>{" "}
                — {e.hours} hours
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}