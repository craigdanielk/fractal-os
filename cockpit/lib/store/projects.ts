"use client";

import { create } from "zustand";
import type { Project } from "../supabase-types";

const initialProjectVersionMap = new Map<string, number>();
const initialProjectLockedBy = new Map<string, string>();

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
  versionMap: initialProjectVersionMap,
  lockedBy: initialProjectLockedBy,

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
    set((state) => {
      const newVersionMap = new Map(state.versionMap);
      newVersionMap.delete(id);
      const newLockedBy = new Map(state.lockedBy);
      newLockedBy.delete(id);
      return {
        projects: state.projects.filter((p) => p.id !== id),
        versionMap: newVersionMap,
        lockedBy: newLockedBy,
      };
    });
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
    const state = get();
    return state.lockedBy.has(id);
  },

  getLockOwner: (id) => {
    const state = get();
    return state.lockedBy.get(id) || null;
  },
}));
