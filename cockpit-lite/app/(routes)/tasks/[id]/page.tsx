"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTaskById } from "@/services/tasks";
import { useTaskStore } from "@/lib/store/tasks";
import { PresenceBar } from "@/components/PresenceBar";
import { CollabField } from "@/components/CollabField";
import { useCollab } from "@/lib/collab/CollabProvider";
import { useLock } from "@/lib/hooks/useLock";
import type { Task } from "@/lib/supabase-types";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const { setViewing } = useCollab();

  // Get task from store (realtime) or fetch initial
  const storeTask = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));

  useEffect(() => {
    async function loadTask() {
      try {
        const fetched = await getTaskById(taskId);
        setTask(fetched);
      } catch (error) {
        console.error("Error loading task:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!storeTask) {
      loadTask();
    } else {
      setTask(storeTask);
      setLoading(false);
    }
  }, [taskId, storeTask]);

  // Update viewing state
  useEffect(() => {
    if (taskId) {
      setViewing(taskId);
    }
  }, [taskId, setViewing]);

  // Use lock for editing
  useLock({ recordType: "task", recordId: taskId, enabled: true });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!task) {
    return <div className="p-6">Task not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Details</h1>
        <PresenceBar module="tasks" />
      </div>

      <div className="max-w-4xl space-y-6">
        <CollabField recordId={taskId} field="task_name" recordType="task">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Task Name</label>
            <input
              type="text"
              defaultValue={task.task_name}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <CollabField recordId={taskId} field="description" recordType="task">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              defaultValue={task.notes || ""}
              rows={6}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="p-2 border rounded bg-white/50">{task.status || "N/A"}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="p-2 border rounded bg-white/50">{task.priority || "N/A"}</div>
          </div>
        </div>

        {task.due_date && (
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <div className="p-2 border rounded bg-white/50">
              {new Date(task.due_date).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

