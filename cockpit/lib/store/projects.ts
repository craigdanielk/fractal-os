"use client";

import { create } from "zustand";
import type { Project } from "../supabase-types";

interface ProjectStore {
  projects: Project[];
  versionMap: Map<string, number>;
  lockedBy: Map<string, string>;
  
  setProjects: (projects: Project[]) => void;
  upsertProject: (project: Project) => void;
  removeProject: (id: string) => void;
  lockProject: (id: string, userId: string) => void;
  unlockProject: (id: string) => void;
  isLocked: (id: string) => boolean;
  getLockOwner: (id: string) => string | null;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  versionMap: new Map(),
  lockedBy: new Map(),

  setProjects: (projects) => {
    set({ projects });
    const versionMap = new Map();
    projects.forEach((project) => {
      versionMap.set(project.id, Date.now());
    });
    set({ versionMap });
  },

  upsertProject: (project) => {
    set((state) => {
      const existing = state.projects.find((p) => p.id === project.id);
      const newProjects = existing
        ? state.projects.map((p) => (p.id === project.id ? project : p))
        : [...state.projects, project];
      
      const newVersionMap = new Map(state.versionMap);
      newVersionMap.set(project.id, Date.now());
      
      return {
        projects: newProjects,
        versionMap: newVersionMap,
      };
    });
  },

  removeProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      versionMap: new Map(state.versionMap).delete(id) && state.versionMap,
      lockedBy: new Map(state.lockedBy).delete(id) && state.lockedBy,
    }));
  },

  lockProject: (id, userId) => {
    set((state) => {
      const newLockedBy = new Map(state.lockedBy);
      newLockedBy.set(id, userId);
      return { lockedBy: newLockedBy };
    });
  },

  unlockProject: (id) => {
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

