import { getProjects } from "@/services/projects";
import { CURRENT_TENANT } from "@/lib/tenant";

export default async function ProjectsPage() {
  const projects = await getProjects(CURRENT_TENANT);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={p.id}>
            <div className="font-medium mb-2">{p.project_name || p.name}</div>
            <div className="text-sm space-y-1">
              <div>Status: {p.status || "N/A"}</div>
              <div>Progress: {p.progress || 0}%</div>
              <div>Health: {p.health_score || "N/A"}</div>
              {p.start_date && <div>Start: {new Date(p.start_date).toLocaleDateString()}</div>}
              {p.target_end_date && <div>End: {new Date(p.target_end_date).toLocaleDateString()}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

