export interface CursorPosition {
  userId: string;
  userName: string;
  recordId: string;
  field: string;
  position: number;
  timestamp: number;
}

export interface EditingState {
  userId: string;
  userName: string;
  recordId: string;
  field: string;
  timestamp: number;
}

export interface PresenceState {
  userId: string;
  name: string;
  avatar: string | null;
  module: string | null;
  activity: "viewing" | "editing" | "idle";
  updated_at: string;
}

export interface CollabState {
  cursors: Map<string, CursorPosition[]>; // recordId -> cursors
  editing: Map<string, Map<string, EditingState[]>>; // recordId -> field -> editors
  presence: PresenceState[];
  currentUserId: string | null;
  currentUserName: string | null;
}

