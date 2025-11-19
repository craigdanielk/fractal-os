/**
 * TimeTracker Component
 *
 * Quick-start time tracking with Start → Stop → Log flow
 */

"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/lib/types";
import { logTimeAction } from "@/app/actions";
import { subscribe } from "@/lib/realtime";

interface TimeTrackerProps {
  tasks: Task[];
  onTimeLogged?: () => void;
  onRefresh?: () => void;
}

export default function TimeTracker({ tasks, onTimeLogged, onRefresh }: TimeTrackerProps) {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  useEffect(() => {
    const unsub = subscribe("time_entries", () => {
      onRefresh?.();
    });
    return () => {
      if (unsub?.unsubscribe) unsub.unsubscribe();
    };
  }, [onRefresh]);

  const handleStart = () => {
    if (!selectedTaskId) return;
    setIsTracking(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    setIsTracking(false);
  };

  const handleLog = async () => {
    if (!selectedTaskId || !startTime) return;

    const hours = elapsedSeconds / 3600;
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;

    try {
      await logTimeAction({
        taskId: selectedTaskId,
        projectId: task.raw["Project"]?.value?.relation?.[0] || "",
        hours: parseFloat(hours.toFixed(2)),
      });

      // Reset
      setIsTracking(false);
      setStartTime(null);
      setElapsedSeconds(0);
      setSelectedTaskId("");
      onTimeLogged?.();
    } catch (error) {
      console.error("Failed to log time:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-card mb-4">
      <h3 className="text-lg font-semibold mb-3">Quick Time Tracker</h3>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <select
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          disabled={isTracking}
        >
          <option value="">Select a task...</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        {isTracking && (
          <div className="text-2xl font-mono font-bold text-blue-500">
            {formatTime(elapsedSeconds)}
          </div>
        )}

        <div className="flex gap-2">
          {!isTracking ? (
            <button
              onClick={handleStart}
              disabled={!selectedTaskId}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
              <button
                onClick={handleLog}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Log
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

