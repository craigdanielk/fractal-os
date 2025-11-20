import { getClients } from "@/services/clients";
import { getCurrentTenant } from "@/lib/auth/tenant";

export default async function ClientsPage() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Not Authenticated</h1>
        <p>Please log in to access clients.</p>
      </div>
    );
  }

  const clients = await getClients();

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Clients</h1>
        </div>

        <div className="grid grid-cols-3 gap-4">

          {clients.map((client) => (

            <div key={client.id} className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl p-4 border border-white/10">

              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-sm text-gray-400">{client.notes || "No description"}</p>
              <div className="mt-2 text-xs space-y-1">
                {client.priority && <div>Priority: {client.priority}</div>}
                {client.email && <div>Email: {client.email}</div>}
              </div>

            </div>

          ))}

        </div>

    </div>
  );
}

