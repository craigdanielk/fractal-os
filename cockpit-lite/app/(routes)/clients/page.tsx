import MainLayout from "@/layouts/MainLayout";

import { getClients } from "@/services/clients";
import { CURRENT_TENANT } from "@/lib/tenant";



export default async function ClientsPage() {

  const clients = await getClients(CURRENT_TENANT);



  return (

    <MainLayout>

      <div className="p-8 space-y-6">

        <h1 className="text-3xl font-bold">Clients</h1>

        <div className="grid grid-cols-3 gap-4">

          {clients.map((client) => (

            <div key={client.id} className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl p-4 border border-white/10">

              <h2 className="text-xl font-semibold">{client.name}</h2>



              <p className="text-sm text-gray-400">{client.notes || "No description"}</p>



              <div className="mt-2 text-xs">

                Status: {client.status || "N/A"}

              </div>

            </div>

          ))}

        </div>

      </div>

    </MainLayout>

  );

}

