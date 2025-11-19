import { LiveState } from "../../../../kernel/workers/state";

export default async function Dashboard() {
  const projects = await LiveState.get("projects");
  const tasks = await LiveState.get("tasks");
  const econ = await LiveState.get("economics");

  const today = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter(t => t.raw["Due Date"]?.value?.date?.start === today);



  return (
    <main className="p-10 flex items-center justify-center min-h-screen">
      <div className="glass-card w-[520px] p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">FractalOS Dashboard</h1>

        <h2 className="font-semibold text-lg">Active Projects</h2>
        <p className="mb-6">
          {projects.length === 0
            ? "No projects found."
            : projects.map(p => p.name).join(", ")}
        </p>

        <h2 className="font-semibold text-lg">Today's Tasks</h2>
        <p className="mb-6">
          {todaysTasks.length === 0
            ? "No tasks for today."
            : todaysTasks.map(t => t.title).join(", ")}
        </p>

        <h2 className="font-semibold text-lg">Economics Snapshot</h2>
        {econ.length === 0 ? (
          <p>No economics data found.</p>
        ) : (
          econ.map(e => (
            <div key={e.id} className="mb-2">
              <p className="font-medium">{e.title}</p>
              <div className="text-sm opacity-70">
                {/* Simple dump of dynamic fields for now */}
                {Object.keys(e.raw).length} fields available
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
