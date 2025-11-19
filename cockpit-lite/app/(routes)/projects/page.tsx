import { LiveState } from "../../../../kernel/workers/state";
import type { Project } from "@/lib/types";

export default async function ProjectsPage() {
  const projects = await LiveState.get("projects");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p: Project) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={p.id}>
            <div className="font-medium mb-2">{p.name}</div>
            <div className="text-sm space-y-1">
              <div>Status: {p.status}</div>
              <div>Progress: {p.progress}%</div>
              <div>Health: {p.health}</div>
              {p.startDate && <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>}
              {p.endDate && <div>End: {new Date(p.endDate).toLocaleDateString()}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

