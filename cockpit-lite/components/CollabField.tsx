"use client";

import { useRef, useEffect, useState } from "react";
import { useCollab } from "../lib/collab/CollabProvider";
import { LiveCursor } from "./LiveCursor";
import { FieldEditors } from "./FieldEditors";
import { getUserColorDark } from "../lib/collab/utils/colors";
import { useLock } from "../lib/hooks/useLock";

interface CollabFieldProps {
  recordId: string;
  field: string;
  recordType: "task" | "project" | "economics" | "time";
  children: React.ReactNode;
  className?: string;
}

export function CollabField({
  recordId,
  field,
  recordType,
  children,
  className = "",
}: CollabFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { getFieldEditors, setCursorPosition, setEditingState, state } = useCollab();
  const [isFocused, setIsFocused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const editors = getFieldEditors(recordId, field);
  const otherEditors = editors.filter((e) => e.userId !== state.currentUserId);
  const hasOtherEditors = otherEditors.length > 0;

  // Use lock hook
  useLock({ recordType, recordId, enabled: isFocused });

  // Track cursor position
  useEffect(() => {
    if (!isFocused || !containerRef.current) return;

    const input = containerRef.current.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement;
    if (!input) return;

    const handleInput = () => {
      const position = input.selectionStart || 0;
      setCursorPosition(recordId, field, position);
    };

    const handleSelectionChange = () => {
      const position = input.selectionStart || 0;
      setCursorPosition(recordId, field, position);
    };

    input.addEventListener("input", handleInput);
    input.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      input.removeEventListener("input", handleInput);
      input.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isFocused, recordId, field, setCursorPosition]);

  // Track editing state
  useEffect(() => {
    if (isFocused) {
      setEditingState(recordId, field, true);
    } else {
      setEditingState(recordId, field, false);
    }
  }, [isFocused, recordId, field, setEditingState]);

  // Determine border color
  const borderColor = hasOtherEditors && otherEditors[0] ? getUserColorDark(otherEditors[0].userId) : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <FieldEditors recordId={recordId} field={field} />
      <LiveCursor recordId={recordId} field={field} containerRef={containerRef} />
      <div
        className={`transition-all ${
          hasOtherEditors ? "ring-2" : ""
        } ${isLocked ? "opacity-50 pointer-events-none" : ""}`}
        style={{
          ...(hasOtherEditors && borderColor ? { borderColor, borderWidth: "2px", borderStyle: "solid" } : {}),
        }}
      >
        {children}
      </div>
      {hasOtherEditors && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          {otherEditors[0].userName} is editing this field
        </div>
      )}
    </div>
  );
}

