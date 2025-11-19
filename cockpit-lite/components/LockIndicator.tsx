"use client";

import { useTaskStore } from "../lib/store/tasks";
import { useProjectStore } from "../lib/store/projects";

interface LockIndicatorProps {
  type: "task" | "project";
  id: string;
  currentUserId: string;
}

export function LockIndicator({ type, id, currentUserId }: LockIndicatorProps) {
  const isTaskLocked = useTaskStore((state) => state.isLocked(id));
  const taskLockOwner = useTaskStore((state) => state.getLockOwner(id));
  const isProjectLocked = useProjectStore((state) => state.isLocked(id));
  const projectLockOwner = useProjectStore((state) => state.getLockOwner(id));

  const isLocked = type === "task" ? isTaskLocked : isProjectLocked;
  const lockOwner = type === "task" ? taskLockOwner : projectLockOwner;

  if (!isLocked || lockOwner === currentUserId) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
      <span>🔒</span>
      <span>Locked by {lockOwner?.substring(0, 8)}...</span>
    </div>
  );
}

