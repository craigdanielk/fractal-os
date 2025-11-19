import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { getTimeEntries } from "@/services/time";
import { getEconomics } from "@/services/economics";
import { getCurrentTenant } from "@/lib/auth/tenant";
import TenantSwitcher from "@/components/TenantSwitcher";

export default async function Dashboard() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Not Authenticated</h1>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  const [projects, tasks, timeEntries, economics] = await Promise.all([
    getProjects(),
    getTasks(),
    getTimeEntries(),
    getEconomics(),
  ]);

  const activeProjects = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled");
  const activeTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const todayTasks = tasks.filter((t) => {
    if (!t.due_date) return false;
    const due = new Date(t.due_date);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  });

  const currentEconomics = economics[0];
  const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.duration_hours || 0), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <TenantSwitcher />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <div className="text-sm opacity-75 mb-1">Active Projects</div>
          <div className="text-2xl font-bold">{activeProjects.length}</div>
          <div className="text-xs opacity-60 mt-1">of {projects.length} total</div>
        </div>
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <div className="text-sm opacity-75 mb-1">Active Tasks</div>
          <div className="text-2xl font-bold">{activeTasks.length}</div>
          <div className="text-xs opacity-60 mt-1">of {tasks.length} total</div>
        </div>
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <div className="text-sm opacity-75 mb-1">Today's Tasks</div>
          <div className="text-2xl font-bold">{todayTasks.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <div className="text-sm opacity-75 mb-1">Total Hours Logged</div>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          <div className="text-xs opacity-60 mt-1">across {timeEntries.length} entries</div>
        </div>
      </div>

      {currentEconomics && (tenantContext.role === "admin" || tenantContext.role === "agency") && (
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 mb-6">
          <h2 className="font-semibold mb-2">Economics Model</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {currentEconomics.base_rate !== null && (
              <div>
                <div className="opacity-75">Base Rate</div>
                <div className="font-semibold">${currentEconomics.base_rate.toFixed(2)}</div>
              </div>
            )}
            {currentEconomics.direct_expenses !== null && (
              <div>
                <div className="opacity-75">Direct Expenses</div>
                <div className="font-semibold">${currentEconomics.direct_expenses.toFixed(2)}</div>
              </div>
            )}
            {currentEconomics.margin_target !== null && (
              <div>
                <div className="opacity-75">Margin Target</div>
                <div className="font-semibold">{currentEconomics.margin_target.toFixed(2)}%</div>
              </div>
            )}
            {currentEconomics.overhead_percent !== null && (
              <div>
                <div className="opacity-75">Overhead</div>
                <div className="font-semibold">{currentEconomics.overhead_percent.toFixed(2)}%</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
