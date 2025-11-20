"use client";

import { create } from "zustand";
import type { Economics } from "../supabase-types";

interface EconomicsStore {
  models: Economics[];
  versionMap: Map<string, number>;
  
  setModels: (models: Economics[]) => void;
  upsertModel: (model: Economics) => void;
  removeModel: (id: string) => void;
}

export const useEconomicsStore = create<EconomicsStore>((set) => ({
  models: [],
  versionMap: new Map(),

  setModels: (models) => {
    set({ models });
    const versionMap = new Map();
    models.forEach((model) => {
      versionMap.set(model.id, Date.now());
    });
    set({ versionMap });
  },

  upsertModel: (model) => {
    set((state) => {
      const existing = state.models.find((m) => m.id === model.id);
      const newModels = existing
        ? state.models.map((m) => (m.id === model.id ? model : m))
        : [...state.models, model];
      
      const newVersionMap = new Map(state.versionMap);
      newVersionMap.set(model.id, Date.now());
      
      return {
        models: newModels,
        versionMap: newVersionMap,
      };
    });
  },

  removeModel: (id) => {
    set((state) => {
      const newVersionMap = new Map(state.versionMap);
      newVersionMap.delete(id);
      return {
        models: state.models.filter((m) => m.id !== id),
        versionMap: newVersionMap,
      };
    });
  },
}));

