

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
      <h1>Time Tracking</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Log Time</h2>

        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
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
          onChange={(e) => setHours(e.target.value)}
          style={{ width: "80px", marginRight: "1rem" }}
        />

        <button onClick={handleLogTime}>Add</button>
      </section>

      <section>
        <h2>Time Entries</h2>
        {entries.length === 0 ? (
          <p>No time entries found.</p>
        ) : (
          <ul>
            {entries.map((e) => (
              <li key={e.id}>
                Task {e.taskId}: {e.hours} hours
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}