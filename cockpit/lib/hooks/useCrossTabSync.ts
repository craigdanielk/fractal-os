"use client";

import { useEffect, useRef } from "react";

interface CrossTabMessage {
  type: string;
  data: any;
  updated_at: string;
}

export function useCrossTabSync(tenantId: string, onMessage?: (msg: CrossTabMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(`fractal:${tenantId}:ui`);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };

    return () => {
      channel.close();
    };
  }, [tenantId, onMessage]);

  const sendMessage = (type: string, data: any) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type,
        data,
        updated_at: new Date().toISOString(),
      });
    }
  };

  return { sendMessage };
}

