"use client";

import { useEffect, useRef } from "react";

interface CrossTabMessage {
  type: string;
  data: any;
  updated_at: string;
}

export function useCrossTabSync(onMessage?: (msg: CrossTabMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const channel = new BroadcastChannel("fractal:ui");
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
      if (onMessageRef.current) {
        onMessageRef.current(event.data);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

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

