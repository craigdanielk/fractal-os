import { LiveState } from "../../../../kernel/workers/state";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function TasksPage() {
  const tasks = await LiveState.get("tasks");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={t.id}>
            <div className="font-medium mb-2">{t.title}</div>
            <DynamicFields raw={t.raw} />
          </div>
        ))}
      </div>
    </div>
  );
}
