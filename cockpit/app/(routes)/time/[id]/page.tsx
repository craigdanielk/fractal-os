"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTimeEntryById } from "@/services/time";
import { PresenceBar } from "@/components/PresenceBar";
import { CollabField } from "@/components/CollabField";
import { useCollab } from "@/lib/collab/CollabProvider";
import type { TimeEntry } from "@/lib/supabase-types";

export default function TimeEntryDetailPage() {
  const params = useParams();
  const entryId = params.id as string;
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { setViewing } = useCollab();

  useEffect(() => {
    async function loadEntry() {
      try {
        const fetched = await getTimeEntryById(entryId);
        setEntry(fetched);
      } catch (error) {
        console.error("Error loading time entry:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [entryId]);

  useEffect(() => {
    if (entryId) {
      setViewing(entryId);
    }
  }, [entryId, setViewing]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!entry) {
    return <div className="p-6">Time entry not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Time Entry</h1>
        <PresenceBar module="time" />
      </div>

      <div className="max-w-4xl space-y-6">
        <CollabField recordId={entryId} field="session_name" recordType="time">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Session Name</label>
            <input
              type="text"
              defaultValue={entry.session_name || ""}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <CollabField recordId={entryId} field="notes" recordType="time">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Session Notes</label>
            <textarea
              defaultValue={entry.notes || ""}
              rows={6}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <div className="p-2 border rounded bg-white/50">
              {entry.duration_hours?.toFixed(2) || "0.00"} hours
            </div>
          </div>
          {entry.session_date && (
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="p-2 border rounded bg-white/50">
                {new Date(entry.session_date).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

