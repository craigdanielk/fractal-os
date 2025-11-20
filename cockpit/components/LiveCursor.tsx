"use client";

import { useEffect, useRef } from "react";
import { useCollab } from "../lib/collab/CollabProvider";
import { getUserColor } from "../lib/collab/utils/colors";
import type { CursorPosition } from "../lib/collab/types";

interface LiveCursorProps {
  recordId: string;
  field: string;
  containerRef: React.RefObject<HTMLElement>;
}

export function LiveCursor({ recordId, field, containerRef }: LiveCursorProps) {
  const { getCursorPositions, state } = useCollab();
  const cursorRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const cursors = getCursorPositions(recordId).filter((c) => c.field === field);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const input = container.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement;
    if (!input) return;

    // Position cursors
    cursors.forEach((cursor) => {
      if (cursor.userId === state.currentUserId) return; // Don't show own cursor

      let cursorEl = cursorRefs.current.get(cursor.userId);
      if (!cursorEl) {
        cursorEl = document.createElement("div");
        cursorEl.className = "absolute pointer-events-none z-50";
        cursorEl.style.width = "2px";
        cursorEl.style.height = "20px";
        cursorEl.style.backgroundColor = getUserColor(cursor.userId);
        cursorEl.style.transition = "opacity 0.2s";
        container.style.position = "relative";
        container.appendChild(cursorEl);
        cursorRefs.current.set(cursor.userId, cursorEl);
      }

      // Calculate position using a more reliable method
      try {
        const textBeforeCursor = input.value.substring(0, cursor.position);
        const textNode = document.createTextNode(textBeforeCursor);
        const measureDiv = document.createElement("div");
        measureDiv.style.position = "absolute";
        measureDiv.style.visibility = "hidden";
        measureDiv.style.whiteSpace = "pre-wrap";
        measureDiv.style.font = window.getComputedStyle(input).font;
        measureDiv.style.padding = window.getComputedStyle(input).padding;
        measureDiv.style.border = window.getComputedStyle(input).border;
        measureDiv.style.width = window.getComputedStyle(input).width;
        measureDiv.textContent = textBeforeCursor;
        document.body.appendChild(measureDiv);

        const inputRect = input.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = measureDiv.offsetWidth - input.scrollLeft;
        const top = measureDiv.offsetHeight - input.scrollTop;

        cursorEl.style.left = `${left}px`;
        cursorEl.style.top = `${top + 2}px`;
        cursorEl.style.opacity = "1";

        document.body.removeChild(measureDiv);
      } catch (error) {
        // Fallback: position at end if calculation fails
        cursorEl.style.left = "0px";
        cursorEl.style.top = "0px";
      }

      // Add label
      let label = cursorEl.querySelector(".cursor-label") as HTMLElement;
      if (!label) {
        label = document.createElement("div");
        label.className = "cursor-label absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap";
        label.style.backgroundColor = getUserColor(cursor.userId);
        cursorEl.appendChild(label);
      }
      label.textContent = cursor.userName;

      document.body.removeChild(measureDiv);
    });

    // Remove stale cursors
    cursorRefs.current.forEach((el, userId) => {
      const exists = cursors.some((c) => c.userId === userId);
      if (!exists) {
        el.remove();
        cursorRefs.current.delete(userId);
      }
    });
  }, [cursors, containerRef, state.currentUserId]);

  return null; // This component renders cursors directly to DOM
}

