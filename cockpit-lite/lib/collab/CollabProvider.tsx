"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { realtimeManager } from "../realtime";
import { usePresenceStore } from "../store/presence";
import type { CursorPosition, EditingState, PresenceState, CollabState } from "./types";
import { getUserColor } from "./utils/colors";

interface CollabContextValue {
  state: CollabState;
  setCursorPosition: (recordId: string, field: string, position: number) => void;
  setEditingState: (recordId: string, field: string, editing: boolean) => void;
  setViewing: (recordId: string) => void;
  setIdle: () => void;
  getActiveEditors: (recordId: string) => EditingState[];
  getCursorPositions: (recordId: string) => CursorPosition[];
  getFieldEditors: (recordId: string, field: string) => EditingState[];
}

const CollabContext = createContext<CollabContextValue | null>(null);

interface CollabProviderProps {
  children: React.ReactNode;
  tenantId: string;
  userId: string;
  userName: string;
}

export function CollabProvider({ children, tenantId, userId, userName }: CollabProviderProps) {
  const [state, setState] = useState<CollabState>({
    cursors: new Map(),
    editing: new Map(),
    presence: [],
    currentUserId: userId,
    currentUserName: userName,
  });

  const cursorThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const lastCursorRef = useRef<{ recordId: string; field: string; position: number } | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const presenceUsers = usePresenceStore((state) => Array.from(state.users.values()));

  // Initialize realtime
  useEffect(() => {
    realtimeManager.initialize(tenantId, userId, userName).then(() => {
      // Subscribe to cursor broadcasts
      realtimeManager.subscribeToBroadcast("cursor", (payload: CursorPosition) => {
        if (payload.userId === userId) return; // Ignore own cursor

        setState((prev) => {
          const newCursors = new Map(prev.cursors);
          const recordCursors = newCursors.get(payload.recordId) || [];
          
          // Remove old cursor from same user
          const filtered = recordCursors.filter((c) => c.userId !== payload.userId);
          
          // Add new cursor
          filtered.push(payload);
          
          // Remove stale cursors (> 2s old)
          const now = Date.now();
          const active = filtered.filter((c) => now - c.timestamp < 2000);
          
          newCursors.set(payload.recordId, active);
          return { ...prev, cursors: newCursors };
        });
      });

      // Subscribe to editing broadcasts
      realtimeManager.subscribeToBroadcast("edit", (payload: EditingState & { action: "start" | "stop" }) => {
        if (payload.userId === userId) return;

        setState((prev) => {
          const newEditing = new Map(prev.editing);
          const recordEditing = newEditing.get(payload.recordId) || new Map();
          const fieldEditors = recordEditing.get(payload.field) || [];

          if (payload.action === "start") {
            // Add editor
            const updated = [...fieldEditors.filter((e) => e.userId !== payload.userId), payload];
            recordEditing.set(payload.field, updated);
          } else {
            // Remove editor
            recordEditing.set(payload.field, fieldEditors.filter((e) => e.userId !== payload.userId));
          }

          newEditing.set(payload.recordId, recordEditing);
          return { ...prev, editing: newEditing };
        });
      });
    });
  }, [tenantId, userId, userName]);

  // Update presence state from store
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      presence: presenceUsers.map((u) => ({
        userId: u.userId,
        name: u.name,
        avatar: u.avatar,
        module: u.module,
        activity: u.activity,
        updated_at: u.updated_at,
      })),
    }));
  }, [presenceUsers]);

  // Cleanup stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setState((prev) => {
        const newCursors = new Map();
        prev.cursors.forEach((cursors, recordId) => {
          const active = cursors.filter((c) => now - c.timestamp < 2000);
          if (active.length > 0) {
            newCursors.set(recordId, active);
          }
        });
        return { ...prev, cursors: newCursors };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setCursorPosition = useCallback(
    (recordId: string, field: string, position: number) => {
      lastActivityRef.current = Date.now();
      lastCursorRef.current = { recordId, field, position };
      
      // Throttle to 10Hz (100ms)
      if (cursorThrottleRef.current) {
        return; // Already scheduled, will use latest position
      }

      cursorThrottleRef.current = setTimeout(() => {
        if (lastCursorRef.current) {
          const cursor: CursorPosition = {
            userId,
            userName,
            recordId: lastCursorRef.current.recordId,
            field: lastCursorRef.current.field,
            position: lastCursorRef.current.position,
            timestamp: Date.now(),
          };

          realtimeManager.sendBroadcast("cursor", cursor);
        }
        cursorThrottleRef.current = null;
      }, 100);
    },
    [userId, userName]
  );

  const setEditingState = useCallback(
    (recordId: string, field: string, editing: boolean) => {
      lastActivityRef.current = Date.now();

      const editState: EditingState & { action: "start" | "stop" } = {
        userId,
        userName,
        recordId,
        field,
        timestamp: Date.now(),
        action: editing ? "start" : "stop",
      };

      realtimeManager.sendBroadcast("edit", editState);

      // Update local state
      setState((prev) => {
        const newEditing = new Map(prev.editing);
        const recordEditing = newEditing.get(recordId) || new Map();
        const fieldEditors = recordEditing.get(field) || [];

        if (editing) {
          const updated = [...fieldEditors.filter((e) => e.userId !== userId), editState];
          recordEditing.set(field, updated);
        } else {
          recordEditing.set(field, fieldEditors.filter((e) => e.userId !== userId));
        }

        newEditing.set(recordId, recordEditing);
        return { ...prev, editing: newEditing };
      });
    },
    [userId, userName]
  );

  const setViewing = useCallback(
    (recordId: string) => {
      lastActivityRef.current = Date.now();
      realtimeManager.updatePresence({ module: recordId, activity: "viewing" });
    },
    []
  );

  const setIdle = useCallback(() => {
    realtimeManager.updatePresence({ activity: "idle" });
  }, []);

  // Idle detection (45 seconds)
  useEffect(() => {
    const checkIdle = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 45000) {
        setIdle();
      }
    }, 5000);

    return () => clearInterval(checkIdle);
  }, [setIdle]);

  const getActiveEditors = useCallback(
    (recordId: string): EditingState[] => {
      const recordEditing = state.editing.get(recordId);
      if (!recordEditing) return [];

      const allEditors: EditingState[] = [];
      recordEditing.forEach((editors) => {
        allEditors.push(...editors);
      });
      return allEditors;
    },
    [state.editing]
  );

  const getCursorPositions = useCallback(
    (recordId: string): CursorPosition[] => {
      return state.cursors.get(recordId) || [];
    },
    [state.cursors]
  );

  const getFieldEditors = useCallback(
    (recordId: string, field: string): EditingState[] => {
      const recordEditing = state.editing.get(recordId);
      if (!recordEditing) return [];
      return recordEditing.get(field) || [];
    },
    [state.editing]
  );

  const value: CollabContextValue = {
    state,
    setCursorPosition,
    setEditingState,
    setViewing,
    setIdle,
    getActiveEditors,
    getCursorPositions,
    getFieldEditors,
  };

  return <CollabContext.Provider value={value}>{children}</CollabContext.Provider>;
}

export function useCollab(): CollabContextValue {
  const context = useContext(CollabContext);
  if (!context) {
    throw new Error("useCollab must be used within CollabProvider");
  }
  return context;
}

