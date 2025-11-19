import { getProjects } from "@/services/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="p-10 flex justify-center min-h-screen">
      <div className="glass-card w-[700px] p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>

        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map(p => (
              <li key={p.id} className="p-3 bg-white/30 rounded-xl backdrop-blur">
                <p className="font-semibold">{p.name}</p>
                <p>Status: {p.status}</p>
                <p>Start: {p.startDate || "-"}</p>
                <p>Due: {p.dueDate || "-"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

