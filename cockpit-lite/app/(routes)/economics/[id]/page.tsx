"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEconomics } from "@/services/economics";
import { useEconomicsStore } from "@/lib/store/economics";
import { PresenceBar } from "@/components/PresenceBar";
import { CollabField } from "@/components/CollabField";
import { useCollab } from "@/lib/collab/CollabProvider";
import type { EconomicsModel } from "@/lib/supabase-types";

export default function EconomicsDetailPage() {
  const params = useParams();
  const modelId = params.id as string;
  const [model, setModel] = useState<EconomicsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const { setViewing } = useCollab();

  const storeModel = useEconomicsStore((state) => state.models.find((m) => m.id === modelId));

  useEffect(() => {
    async function loadModel() {
      try {
        const models = await getEconomics();
        const found = models.find((m) => m.id === modelId);
        setModel(found || null);
      } catch (error) {
        console.error("Error loading economics model:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!storeModel) {
      loadModel();
    } else {
      setModel(storeModel);
      setLoading(false);
    }
  }, [modelId, storeModel]);

  useEffect(() => {
    if (modelId) {
      setViewing(modelId);
    }
  }, [modelId, setViewing]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!model) {
    return <div className="p-6">Economics model not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Economics Model</h1>
        <PresenceBar module="economics" />
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <CollabField recordId={modelId} field="base_rate" recordType="economics">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Base Rate</label>
              <input
                type="number"
                defaultValue={model.base_rate?.toString() || "0"}
                className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
                readOnly
              />
            </div>
          </CollabField>

          <CollabField recordId={modelId} field="direct_expenses" recordType="economics">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Direct Expenses</label>
              <input
                type="number"
                defaultValue={model.direct_expenses?.toString() || "0"}
                className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
                readOnly
              />
            </div>
          </CollabField>

          <CollabField recordId={modelId} field="margin_target" recordType="economics">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Margin Target (%)</label>
              <input
                type="number"
                defaultValue={model.margin_target?.toString() || "0"}
                className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
                readOnly
              />
            </div>
          </CollabField>

          <CollabField recordId={modelId} field="overhead_percent" recordType="economics">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Overhead (%)</label>
              <input
                type="number"
                defaultValue={model.overhead_percent?.toString() || "0"}
                className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
                readOnly
              />
            </div>
          </CollabField>
        </div>
      </div>
    </div>
  );
}

