import { getTasks } from "@/services/tasks";
import { CURRENT_TENANT } from "@/lib/tenant";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function TasksPage() {
  const tasks = await getTasks(CURRENT_TENANT);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={t.id}>
            <div className="font-medium mb-2">{t.task_name || t.name}</div>
            <div className="text-sm">
              <div>Status: {t.status}</div>
              <div>Priority: {t.priority}</div>
              {t.due_date && <div>Due: {new Date(t.due_date).toLocaleDateString()}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
