import { createClient } from "@supabase/supabase-js";

// Realtime Manager (full API)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Callback = (payload: any) => void;
const channels: Record<string, Callback[]> = {};
const broadcastChannels: Record<string, Callback[]> = {};
let initialized = false;
let currentUserId: string | null = null;
let currentUserName: string | null = null;

// Presence channel
let presenceChannel: ReturnType<typeof supabase.channel> | null = null;

export const realtimeManager = {
  subscribe,
  triggerLocal,
  initialize,
  subscribeToTable,
  subscribeToBroadcast,
  sendBroadcast,
  updatePresence,
};

/**
 * Legacy subscribe function (for backward compatibility)
 */
export function subscribe(table: string, cb: Callback) {
  if (!channels[table]) channels[table] = [];
  channels[table].push(cb);

  return supabase
    .channel(`realtime:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        for (const fn of channels[table]) fn(payload);
      }
    )
    .subscribe();
}

export function triggerLocal(table: string, payload: any) {
  if (!channels[table]) return;
  for (const fn of channels[table]) fn(payload);
}

/**
 * Initialize realtime connection with user context
 */
export async function initialize(
  userId: string,
  userName: string
): Promise<void> {
  if (initialized && currentUserId === userId) {
    return; // Already initialized for this context
  }

  currentUserId = userId;
  currentUserName = userName;

  // Initialize presence channel
  if (!presenceChannel) {
    presenceChannel = supabase.channel("presence", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel?.presenceState();
        // Trigger presence callbacks if any
        if (broadcastChannels["presence"]) {
          broadcastChannels["presence"].forEach((cb) => cb(state));
        }
      })
      .subscribe();

    initialized = true;
  }
}

/**
 * Subscribe to table changes
 */
export function subscribeToTable(
  table: string,
  callback: (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new?: any;
    old?: any;
  }) => void
): () => void {
  const channel = supabase
    .channel(`table:${table}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table,
      },
      (payload) => {
        callback({
          eventType:
            payload.eventType === "INSERT"
              ? "INSERT"
              : payload.eventType === "UPDATE"
              ? "UPDATE"
              : "DELETE",
          new: payload.new,
          old: payload.old,
        });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

/**
 * Subscribe to broadcast channel
 */
export function subscribeToBroadcast(
  channelName: string,
  callback: (payload: any) => void
): () => void {
  if (!broadcastChannels[channelName]) {
    broadcastChannels[channelName] = [];
  }
  broadcastChannels[channelName].push(callback);

  const channel = supabase.channel(`broadcast:${channelName}`).subscribe();

  return () => {
    broadcastChannels[channelName] = broadcastChannels[channelName].filter(
      (cb) => cb !== callback
    );
    channel.unsubscribe();
  };
}

/**
 * Send broadcast message
 */
export function sendBroadcast(channelName: string, payload: any): void {
  const channel = supabase.channel(`broadcast:${channelName}`);
  channel.send({
    type: "broadcast",
    event: channelName,
    payload,
  });
}

/**
 * Update presence state
 */
export function updatePresence(state: {
  module?: string | null;
  activity?: "viewing" | "editing" | "idle";
}): void {
  if (!presenceChannel || !currentUserId) return;

  presenceChannel.track({
    userId: currentUserId,
    userName: currentUserName || "User",
    module: state.module || null,
    activity: state.activity || "idle",
    updated_at: new Date().toISOString(),
  });
}

/**
 * Subscribe to presence changes (for usePresence hook)
 */
export function subscribeToPresence(
  callback: (state: Record<string, any[]>) => void
): () => void {
  if (!broadcastChannels["presence"]) {
    broadcastChannels["presence"] = [];
  }
  broadcastChannels["presence"].push(callback);

  return () => {
    broadcastChannels["presence"] = broadcastChannels["presence"].filter(
      (cb) => cb !== callback
    );
  };
}
