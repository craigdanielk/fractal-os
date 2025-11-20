"use client";

import { useCollab } from "../lib/collab/CollabProvider";
import { getUserColor } from "../lib/collab/utils/colors";

interface PresenceBarProps {
  module: "tasks" | "projects" | "economics" | "time";
}

export function PresenceBar({ module }: PresenceBarProps) {
  const { state } = useCollab();

  // Filter presence by module
  const moduleUsers = state.presence.filter(
    (user) => user.module === module || (user.module === null && user.activity !== "idle")
  );

  if (moduleUsers.length === 0) {
    return null;
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "editing":
        return "bg-green-500";
      case "viewing":
        return "bg-blue-500";
      case "idle":
        return "bg-yellow-500 opacity-50";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur rounded-lg border border-white/30">
      <span className="text-xs text-gray-600 mr-2">Active:</span>
      <div className="flex -space-x-2">
        {moduleUsers.slice(0, 5).map((user) => {
          const color = getUserColor(user.userId);
          const isIdle = user.activity === "idle";
          
          return (
            <div
              key={user.userId}
              className={`relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold ${
                isIdle ? "opacity-50" : ""
              }`}
              style={{ backgroundColor: color }}
              title={`${user.name} - ${user.activity}`}
            >
              {user.name.charAt(0).toUpperCase()}
              {!isIdle && (
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getActivityColor(
                    user.activity
                  )}`}
                />
              )}
            </div>
          );
        })}
        {moduleUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
            +{moduleUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}

