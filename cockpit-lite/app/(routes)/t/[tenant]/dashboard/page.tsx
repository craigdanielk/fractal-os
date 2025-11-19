import TenantSwitcher from "@/components/TenantSwitcher";



export default function TenantDashboard({ params }: { params: { tenant: string } }) {

return (

<div className="p-6">

<TenantSwitcher />

<h1 className="text-xl font-semibold mb-4 mt-4">Dashboard: {params.tenant}</h1>

<p>Tenant-scoped view for {params.tenant}</p>

</div>

);

}

