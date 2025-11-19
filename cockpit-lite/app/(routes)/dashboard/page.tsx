import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { CURRENT_TENANT } from "@/lib/tenant";

export default async function Dashboard() {
  const tenantId = CURRENT_TENANT;
  const projects = await getProjects(tenantId);
  const tasks = await getTasks(tenantId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold mb-2">Projects: {projects.length}</h2>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Tasks: {tasks.length}</h2>
        </div>
      </div>
    </div>
  );
}
