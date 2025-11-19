import { getTimeEntries } from "@/services/time";
import { CURRENT_TENANT } from "@/lib/tenant";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function TimePage() {
  const entries = await getTimeEntries(CURRENT_TENANT);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((s: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={s.id}>
            <div className="font-medium mb-2">{s.session_name || "Session"}</div>
            <div className="text-sm">
              {s.session_date && <div>Date: {new Date(s.session_date).toLocaleDateString()}</div>}
              {s.duration_hours && <div>Duration: {s.duration_hours} hours</div>}
              {s.notes && <div>Notes: {s.notes}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
