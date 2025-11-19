import { getProjects } from "@/services/projects";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={p.id}>
            <div className="font-medium mb-2">{p.title}</div>
            <DynamicFields raw={p.raw} />
          </div>
        ))}
      </div>
    </div>
  );
}

