import { getTasks } from "@/services/tasks";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className="p-10 flex justify-center min-h-screen">
      <div className="glass-card w-[700px] p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map(t => (
              <li key={t.id} className="p-3 bg-white/30 rounded-xl backdrop-blur">
                <p className="font-semibold">{t.name}</p>
                <p>Status: {t.status}</p>
                <p>Due: {t.dueDate || "-"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
