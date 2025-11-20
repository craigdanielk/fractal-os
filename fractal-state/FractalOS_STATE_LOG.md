

# FractalOS State Log (Initial Snapshot)

## Overview
This document acts as the persistent internal state memory for FractalOS.  
It is used exclusively by the AI system to maintain long‑range continuity, recall architectural decisions, track system constraints, and ensure coherent multi‑phase development across sessions.

---

## System Architecture Summary
- **Platform**: Next.js (App Router), TypeScript, Supabase (Auth, DB, RLS, Realtime), Dexie (Offline), Zustand (State), Cursor MCP (DevOps).
- **Core Nodes**:
  - Cockpit (Front-end UI)
  - Kernel (Backend logic engine)
  - Agents Layer (AI workflows)
  - Supabase Backend (Tenants, Clients, Projects, Tasks, Time, Economics)
- **Primary Mandate**: Build a fully tenant-isolated PMOS (Personal/Professional Management OS) capable of automating agencies, client operations, and AI-driven workflows.

---

## Current Verified State (Post-Batch5)
- Cockpit compiles successfully in dev.
- Infinite loops fixed in all realtime hooks.
- All server↔client boundaries validated.
- RLS policies repaired via Light-RLS mode (current temporary mode).
- Full refactoring from Notion to Supabase complete.
- Presence, Realtime, Locking, Offline Sync all stabilized.
- All kernel imports removed from Cockpit.
- Build hardening completed.

---

## Outstanding High-Level Tasks
- Light RLS → Full Model‑X RLS Migration (later)
- OAuth multi-tenant login rollout
- Mobile responsive layout pass
- UI theme refinement
- Analytics dashboard activation
- Kernel-to-Cockpit type streaming (optional optimisation)

---

## Critical Invariants (Do Not Break)
1. **Tenant Isolation Always On**  
   No service, subscription, or query may run without a tenant_id.

2. **Cockpit Never Imports Kernel**  
   All cross-layer communication must flow through Supabase.

3. **Realtime Must Subscribe Once Per Page**  
   Never inside service functions.

4. **Offline Sync Must Never Conflict With RLS**  
   Sync queue must always apply tenant filter.

5. **All Server Components Use supabase-client-server**  
   All Client Components use supabase-client-browser.

---

## DevOps Invariants
- Cursor is the primary orchestrator.
- All patches must be delivered in single-block, M2M-safe instructions.
- FractalOS_STATE_LOG.md serves as AI system RAM extension.

---

## Current Phase
**Phase: Post-Batch5 / Pre-Launch Hardening**  
System runs, but pages still route to 404 (cause: build layer not fully synced; route exports not complete).

---

## Next Actions (AI-Controlled)
1. Fix Cockpit routing layer.
2. Rebuild sidebar → dynamic, tenant-aware, stateless.
3. Validate environment pipeline (.env.local → server → clients).
4. Execute final pre-launch integration sweep.

---

## Logged At
Timestamp (local): _pending initial write_  

---

End of initial snapshot.