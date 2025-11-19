import { getTimeEntries } from "@/services/time";
import { getCurrentTenant } from "@/lib/auth/tenant";
import TenantSwitcher from "@/components/TenantSwitcher";
import { PresenceBar } from "@/components/PresenceBar";
import Link from "next/link";

export default async function TimePage() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Not Authenticated</h1>
        <p>Please log in to access time entries.</p>
      </div>
    );
  }

  const entries = await getTimeEntries();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <div className="flex items-center gap-4">
          <PresenceBar module="time" />
          <TenantSwitcher />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((s) => (
          <Link
            href={`/time/${s.id}`}
            key={s.id}
            className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition"
          >
            <div className="font-medium mb-2">{s.session_name || "Session"}</div>
            <div className="text-sm">
              {s.session_date && <div>Date: {new Date(s.session_date).toLocaleDateString()}</div>}
              {s.duration_hours && <div>Duration: {s.duration_hours.toFixed(2)} hours</div>}
              {s.start_time && s.end_time && (
                <div>
                  Time: {new Date(s.start_time).toLocaleTimeString()} - {new Date(s.end_time).toLocaleTimeString()}
                </div>
              )}
              {s.notes && <div>Notes: {s.notes}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
