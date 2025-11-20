"use client";

import { create } from "zustand";
import type { Task } from "../supabase-types";

interface TaskStore {
  tasks: Task[];
  versionMap: Map<string, number>;
  lockedBy: Map<string, string>;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  upsertTask: (task: Task) => void;
  removeTask: (id: string) => void;
  lockTask: (id: string, userId: string) => void;
  unlockTask: (id: string) => void;
  isLocked: (id: string) => boolean;
  getLockOwner: (id: string) => string | null;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  versionMap: new Map(),
  lockedBy: new Map(),

  setTasks: (tasks) => {
    set({ tasks });
    const versionMap = new Map();
    tasks.forEach((task) => {
      versionMap.set(task.id, Date.now());
    });
    set({ versionMap });
  },

  upsertTask: (task) => {
    set((state) => {
      const existing = state.tasks.find((t) => t.id === task.id);
      const newTasks = existing
        ? state.tasks.map((t) => (t.id === task.id ? task : t))
        : [...state.tasks, task];
      
      const newVersionMap = new Map(state.versionMap);
      newVersionMap.set(task.id, Date.now());
      
      return {
        tasks: newTasks,
        versionMap: newVersionMap,
      };
    });
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      versionMap: new Map(state.versionMap).delete(id) && state.versionMap,
      lockedBy: new Map(state.lockedBy).delete(id) && state.lockedBy,
    }));
  },

  lockTask: (id, userId) => {
    set((state) => {
      const newLockedBy = new Map(state.lockedBy);
      newLockedBy.set(id, userId);
      return { lockedBy: newLockedBy };
    });
  },

  unlockTask: (id) => {
    set((state) => {
      const newLockedBy = new Map(state.lockedBy);
      newLockedBy.delete(id);
      return { lockedBy: newLockedBy };
    });
  },

  isLocked: (id) => {
    return get().lockedBy.has(id);
  },

  getLockOwner: (id) => {
    return get().lockedBy.get(id) || null;
  },
}));

