import { getSessions } from "@/services/time";
import { DynamicFields } from "../../../components/DynamicFields";

export default async function TimePage() {
  const sessions = await getSessions();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s: any) => (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10" key={s.id}>
            <div className="font-medium mb-2">{s.title}</div>
            <DynamicFields raw={s.raw} />
          </div>
        ))}
      </div>
    </div>
  );
}
