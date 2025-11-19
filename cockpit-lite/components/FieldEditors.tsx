"use client";

import { useCollab } from "../lib/collab/CollabProvider";
import { getUserColor } from "../lib/collab/utils/colors";

interface FieldEditorsProps {
  recordId: string;
  field: string;
}

export function FieldEditors({ recordId, field }: FieldEditorsProps) {
  const { getFieldEditors, state } = useCollab();
  const editors = getFieldEditors(recordId, field).filter((e) => e.userId !== state.currentUserId);

  if (editors.length === 0) {
    return null;
  }

  return (
    <div className="absolute -top-6 left-0 flex items-center gap-1 z-10">
      {editors.slice(0, 3).map((editor) => {
        const color = getUserColor(editor.userId);
        return (
          <div
            key={editor.userId}
            className="px-2 py-1 rounded text-xs text-white flex items-center gap-1"
            style={{ backgroundColor: color }}
          >
            <span>{editor.userName}</span>
            <span className="opacity-75">editing...</span>
          </div>
        );
      })}
      {editors.length > 3 && (
        <div className="px-2 py-1 rounded text-xs bg-gray-500 text-white">
          +{editors.length - 3} others
        </div>
      )}
    </div>
  );
}

