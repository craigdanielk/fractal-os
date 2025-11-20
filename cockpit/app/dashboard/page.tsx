import GlassPanel from "@/components/GlassPanel";
import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { getTimeEntries } from "@/services/time";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [projects, tasks, time] = await Promise.all([
    getProjects(),
    getTasks(),
    getTimeEntries(),
  ]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <GlassPanel>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <p className="text-white/60">{projects.length} total projects</p>
      </GlassPanel>
      <GlassPanel>
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <p className="text-white/60">{tasks.length} tasks in progress</p>
      </GlassPanel>
      <GlassPanel>
        <h2 className="text-xl font-semibold mb-4">Time Tracked</h2>
        <p className="text-white/60">{time.length} entries logged</p>
      </GlassPanel>
    </div>
  );
}
