"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase";

export function ClientSelector() {
  const [clients, setClients] = useState<any[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    supabase
      .from("clients")
      .select("*")
      .then(({ data }) => {
        if (data) setClients(data);
      });
  }, []);

  useEffect(() => {
    if (active) {
      localStorage.setItem("active_client", active);
    } else {
      localStorage.removeItem("active_client");
    }
  }, [active]);

  // Load active client from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("active_client");
    if (stored) {
      setActive(stored);
    }
  }, []);

  return (
    <div className="flex gap-2">
      <select
        className="rounded bg-neutral-900 text-white p-2"
        value={active}
        onChange={(e) => setActive(e.target.value)}
      >
        <option value="">All Clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

