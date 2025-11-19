"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export default function TenantSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenants() {
      try {
        // Fetch tenant context and list from API
        const response = await fetch("/api/tenants");
        
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTenants(data.tenants || []);
        setCurrentTenantId(data.currentTenantId || null);
        setRole(data.role || null);
      } catch (error) {
        console.error("Error loading tenants:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTenants();
  }, []);

  // Don't show switcher for clients
  if (role === "client" || loading) {
    return null;
  }

  // Don't show if only one tenant accessible
  if (tenants.length <= 1) {
    return null;
  }

  const handleTenantChange = (tenantId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tenant", tenantId);
    router.push(`?${params.toString()}`);
    
    // Update session cookie
    document.cookie = `sb-tenant-id=${tenantId}; path=/; max-age=86400`;
    
    // Reload to apply new tenant context
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm opacity-75">Tenant:</label>
      <select
        value={currentTenantId || ""}
        onChange={(e) => handleTenantChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm bg-white dark:bg-neutral-900"
      >
        {tenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
    </div>
  );
}
