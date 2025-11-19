import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { getEconomics } from "@/services/economics";

export default async function Dashboard() {
  const projects = await getProjects();
  const tasks = await getTasks();
  const econ = await getEconomics();

  const today = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter(t => t.dueDate === today);

  const econModel = econ[0] || {
    revenue: 0,
    labour: 0,
    overhead: 0,
    direct: 0,
    margin: 0,
  };

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
            : todaysTasks.map(t => t.name).join(", ")}
        </p>

        <h2 className="font-semibold text-lg">Economics Snapshot</h2>
        <p>Revenue: {econModel.revenue}</p>
        <p>Labour Cost: {econModel.labour}</p>
        <p>Overhead: {econModel.overhead}</p>
        <p>Direct Expenses: {econModel.direct}</p>
        <p>Margin: {econModel.margin}%</p>
      </div>
    </main>
  );
}
