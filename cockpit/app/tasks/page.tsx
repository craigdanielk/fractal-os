import { getTasks } from "@/services/tasks";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="tasks" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <Link
            href={`/tasks/${t.id}`}
            key={t.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition"
          >
            <div className="font-medium mb-2">{t.name}</div>
            <div className="text-sm">
              <div>Status: {t.status || "N/A"}</div>
              {t.priority && <div>Priority: {t.priority}</div>}
              {t.due_date && <div>Due: {new Date(t.due_date).toLocaleDateString()}</div>}
              {t.project && <div>Project: {t.project.name}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
