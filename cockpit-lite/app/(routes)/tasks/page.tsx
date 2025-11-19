import { getTasks } from "@/services/tasks";
import { getCurrentTenant } from "@/lib/auth/tenant";
import TenantSwitcher from "@/components/TenantSwitcher";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export default async function TasksPage() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Not Authenticated</h1>
        <p>Please log in to access tasks.</p>
      </div>
    );
  }

  const tasks = await getTasks();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="tasks" />
          <TenantSwitcher />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <Link
            href={`/tasks/${t.id}`}
            key={t.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition"
          >
            <div className="font-medium mb-2">{t.task_name}</div>
            <div className="text-sm">
              <div>Status: {t.status || "N/A"}</div>
              <div>Priority: {t.priority || "N/A"}</div>
              {t.due_date && <div>Due: {new Date(t.due_date).toLocaleDateString()}</div>}
              {t.assignee && <div>Assignee: {t.assignee}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
