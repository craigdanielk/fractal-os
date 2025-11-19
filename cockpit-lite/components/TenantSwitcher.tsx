"use client";

import { useEffect, useState } from "react";



export default function TenantSwitcher() {

const [tenant, setTenant] = useState<string | null>(null);



useEffect(() => {

const t = localStorage.getItem("tenant_id") || "fractal-root";

setTenant(t);

}, []);



function changeTenant(newTenant: string) {

localStorage.setItem("tenant_id", newTenant);

document.cookie = `tenant_id=${newTenant}; path=/`;

window.location.href = `/t/${newTenant}/dashboard`;

}



return (

<div className="flex items-center gap-2">

<span className="text-sm">Tenant:</span>

<select

className="border rounded p-1 text-sm"

value={tenant || ""}

onChange={(e) => changeTenant(e.target.value)}

>

<option value="fractal-root">Fractal Root</option>

<option value="agency">Agency</option>

<option value="client">Client</option>

</select>

</div>

);

}

