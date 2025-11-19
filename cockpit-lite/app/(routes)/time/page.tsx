import { getTimeEntries } from "@/services/time";
import { getTasks } from "@/services/tasks";

export default async function TimePage() {
  const entries = await getTimeEntries();
  const tasks = await getTasks();

  const lookup = Object.fromEntries(
    tasks.map(t => [t.id, t.name])
  );

  return (
    <main className="p-10 flex justify-center min-h-screen">
      <div className="glass-card w-[700px] p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Time Tracking</h1>

        {entries.length === 0 ? (
          <p>No time entries logged.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map(e => (
              <li key={e.id} className="p-3 bg-white/30 rounded-xl backdrop-blur">
                <p>Task: {lookup[e.task[0]] || "Unknown"}</p>
                <p>Hours: {e.hours}</p>
                <p>Date: {e.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
