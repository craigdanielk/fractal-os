# Phase 20: Realtime Engine Implementation Summary

## Overview
Phase 20 implements a comprehensive realtime synchronization system for FractalOS Cockpit-Lite, enabling live updates, multi-user collaboration, and cross-device sync.

## Core Components

### 1. Realtime Manager (`lib/realtime.ts`)
- **Singleton pattern** for managing Supabase Realtime connections
- **Tenant-scoped channels**: `fractal:${tenantId}` and `presence:${tenantId}`
- **Features**:
  - Postgres changes subscriptions
  - Broadcast messaging
  - Presence tracking
  - Automatic reconnection handling

### 2. Zustand Stores (`lib/store/`)
- **tasks.ts**: Task state with versioning and locking
- **projects.ts**: Project state with versioning and locking
- **economics.ts**: Economics model state
- **presence.ts**: User presence state

**Store Features**:
- Version maps for conflict resolution
- Lock tracking (`lockedBy` maps)
- Optimistic updates support
- Event patches for incremental updates

### 3. React Hooks (`lib/hooks/`)
- **useRealtimeTasks()**: Subscribes to tasks table changes
- **useRealtimeProjects()**: Subscribes to projects table changes
- **useRealtimeEconomics()**: Subscribes to economics_model changes
- **useRealtimeTimer()**: Syncs timer state across devices
- **usePresence()**: Manages user presence
- **useCrossTabSync()**: BroadcastChannel for cross-tab UI sync
- **useLock()**: Document locking with heartbeat

### 4. Document Locking System

**Database Migration**: `0009_editing_locks.sql`
- Table: `editing_locks`
- Fields: `tenant_id`, `record_type`, `record_id`, `locked_by`, `locked_at`, `expires_at`
- Auto-cleanup of expired locks
- RLS policies for tenant isolation

**Server Actions**: `lib/actions/locks.ts`
- `lockRecord()`: Acquire lock
- `unlockRecord()`: Release lock
- `heartbeat()`: Extend lock (every 5s)

**Client Hook**: `useLock()`
- Automatically acquires lock on mount
- Sends heartbeat every 5 seconds
- Releases lock on unmount
- Broadcasts lock/unlock events

### 5. Presence Engine

**Features**:
- Real-time user presence tracking
- Module-level activity (tasks/projects/economics/time)
- Activity states: viewing, editing, idle
- Presence indicators in UI

**Components**:
- `PresenceIndicator.tsx`: Shows active users per module
- `LockIndicator.tsx`: Shows lock status

### 6. RealtimeProvider Component

Wraps the application and initializes:
- All realtime subscriptions
- Presence tracking
- Cross-tab sync
- Broadcast listeners

## Integration Points

### Layout (`app/layout.tsx`)
- Wraps app with `<RealtimeProvider>`
- Initializes realtime connections on mount

### Services
- Services continue to use `dbQuery` for initial data loading
- Realtime hooks update stores automatically
- UI reads from stores instead of direct service calls

## Realtime Sync Rules

### Tasks
- INSERT → Add to store
- UPDATE → Update in store
- DELETE → Remove from store
- Lock changes → Update lock state

### Projects
- Same as tasks
- Updates propagate to MiniGantt (if implemented)

### Economics
- Always visible (no tenant filter)
- Updates trigger chart recalculation
- Broadcast events for dependent calculations

### Time Entries
- Timer state syncs across devices
- Cross-device pause/resume support
- "Other users tracking time" indicator

## Broadcast Events

### Task Events
- `task:lock` - Lock/unlock events
- `task:created` - New task notification
- `task:completed` - Task completion

### Project Events
- `project:lock` - Lock/unlock events
- `project:updated` - Project changes

### Economics Events
- `economics:updated` - Model changes

### Timer Events
- `timer:control` - Start/pause/stop commands

### UI Events (Cross-tab)
- Theme changes
- Dark mode toggle
- Sidebar state
- Recently opened items

## Cross-Tab Sync

Uses `BroadcastChannel` API:
- Channel: `fractal:${tenantId}:ui`
- Syncs UI state across browser tabs
- Handles theme, sidebar, and navigation state

## Cleanup

- ✅ Removed Notion polling logic (already done in Phase 14)
- ✅ All queries use Supabase Realtime
- ✅ No static polling remains

## Next Steps

1. **Test realtime connections**:
   - Open multiple browser tabs
   - Verify updates sync instantly
   - Test lock acquisition/release

2. **Implement optimistic updates**:
   - Update UI immediately on user action
   - Sync with server response
   - Handle conflicts gracefully

3. **Add conflict resolution**:
   - Last-write-wins (current)
   - Consider operational transforms for better UX

4. **Enhance presence**:
   - Show user avatars
   - Add "typing" indicators
   - Show cursor positions (advanced)

5. **Timer enhancements**:
   - Cross-device pause/resume
   - Time tracking notifications
   - Active timer indicators

## Files Created

### Core Infrastructure
- `lib/realtime.ts` - Realtime manager
- `lib/store/tasks.ts` - Task store
- `lib/store/projects.ts` - Project store
- `lib/store/economics.ts` - Economics store
- `lib/store/presence.ts` - Presence store

### Hooks
- `lib/hooks/useRealtimeTasks.ts`
- `lib/hooks/useRealtimeProjects.ts`
- `lib/hooks/useRealtimeEconomics.ts`
- `lib/hooks/useRealtimeTimer.ts`
- `lib/hooks/usePresence.ts`
- `lib/hooks/useCrossTabSync.ts`
- `lib/hooks/useLock.ts`

### Components
- `components/RealtimeProvider.tsx`
- `components/PresenceIndicator.tsx`
- `components/LockIndicator.tsx`

### Database
- `supabase/migrations/0009_editing_locks.sql`

### Server Actions
- `lib/actions/locks.ts`

## Files Modified
- `app/layout.tsx` - Added RealtimeProvider wrapper

## Testing Checklist

- [ ] Open two browser tabs, create task in one → appears in other
- [ ] Edit task in one tab → updates in other tab
- [ ] Lock task → shows lock indicator
- [ ] Switch tabs → UI state syncs
- [ ] Start timer → syncs across devices
- [ ] Presence indicators show active users
- [ ] Economics updates trigger chart refresh
- [ ] MiniGantt updates live (if implemented)

## Performance Considerations

- Realtime subscriptions are tenant-scoped (efficient)
- Stores use version maps for conflict detection
- Heartbeat interval: 5 seconds (configurable)
- Lock expiration: 30 seconds (configurable)
- Presence updates debounced (via Supabase)

## Security

- All realtime channels are tenant-scoped
- RLS policies enforce tenant isolation
- Lock operations require authentication
- Presence data filtered by tenant membership

