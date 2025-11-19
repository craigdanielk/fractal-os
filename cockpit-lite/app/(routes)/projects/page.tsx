import { getProjects } from "@/services/projects";
import { getCurrentTenant } from "@/lib/auth/tenant";
import TenantSwitcher from "@/components/TenantSwitcher";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export default async function ProjectsPage() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Not Authenticated</h1>
        <p>Please log in to access projects.</p>
      </div>
    );
  }

  const projects = await getProjects();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="projects" />
          <TenantSwitcher />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link
            href={`/projects/${p.id}`}
            key={p.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition"
          >
            <div className="font-medium mb-2">{p.project_name}</div>
            <div className="text-sm space-y-1">
              <div>Status: {p.status || "N/A"}</div>
              <div>Priority: {p.priority || "N/A"}</div>
              <div>Health: {p.health_score || "N/A"}</div>
              {p.start_date && <div>Start: {new Date(p.start_date).toLocaleDateString()}</div>}
              {p.target_end_date && <div>End: {new Date(p.target_end_date).toLocaleDateString()}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

