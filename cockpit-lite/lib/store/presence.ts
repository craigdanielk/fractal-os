"use client";

import { create } from "zustand";

interface PresenceUser {
  userId: string;
  name: string;
  avatar: string | null;
  module: string | null;
  activity: "viewing" | "editing" | "idle";
  updated_at: string;
}

interface PresenceStore {
  users: Map<string, PresenceUser>;
  
  setUsers: (users: PresenceUser[]) => void;
  updateUser: (userId: string, data: Partial<PresenceUser>) => void;
  removeUser: (userId: string) => void;
  getUsersByModule: (module: string) => PresenceUser[];
}

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  users: new Map(),

  setUsers: (users) => {
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.userId, user);
    });
    set({ users: userMap });
  },

  updateUser: (userId, data) => {
    set((state) => {
      const newUsers = new Map(state.users);
      const existing = newUsers.get(userId);
      if (existing) {
        newUsers.set(userId, { ...existing, ...data, updated_at: new Date().toISOString() });
      } else {
        newUsers.set(userId, {
          userId,
          name: "",
          avatar: null,
          module: null,
          activity: "idle",
          updated_at: new Date().toISOString(),
          ...data,
        });
      }
      return { users: newUsers };
    });
  },

  removeUser: (userId) => {
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.delete(userId);
      return { users: newUsers };
    });
  },

  getUsersByModule: (module) => {
    const users = Array.from(get().users.values());
    return users.filter((u) => u.module === module && u.activity !== "idle");
  },
}));

