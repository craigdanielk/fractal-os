"use client";

import { usePresenceStore } from "../lib/store/presence";

interface PresenceIndicatorProps {
  module: string;
}

export function PresenceIndicator({ module }: PresenceIndicatorProps) {
  const users = usePresenceStore((state) => state.getUsersByModule(module));

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg backdrop-blur">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <div
            key={user.userId}
            className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
            title={`${user.name} is ${user.activity}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
            +{users.length - 3}
          </div>
        )}
      </div>
      <span className="text-xs text-gray-600">
        {users.length} {users.length === 1 ? "user" : "users"} active
      </span>
    </div>
  );
}

