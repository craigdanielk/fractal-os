# PRE-LIFT PHASE 1: COCKPIT STABILISATION PATCH PLAN

## STRUCTURE VALIDATION

✅ **STRUCTURE VERIFIED**

- ✓ Next.js app located at `/cockpit`
- ✓ Only Next.js app in repository
- ✓ `/cockpit/package.json` contains: next, react, react-dom
- ✓ No legacy folders: cockpit-lite, frontend removed
- ✓ Kernel directory exists at `/kernel`
- ✓ `/kernel/utils/safe-query.ts` exists

---

## PATCH PLAN

### 1. KERNEL IMPORTS → COCKPIT EQUIVALENTS

**Files requiring `kernel/utils/safe-query` replacement:**

- `cockpit/services/economics.ts` (line 2)
- `cockpit/services/tasks.ts` (line 2)
- `cockpit/services/projects.ts` (line 2)
- `cockpit/services/vendors.ts` (line 2)

**Action:** Create `cockpit/lib/safe-query.ts` by copying `kernel/utils/safe-query.ts` and adapting for cockpit context.

**Diff Intent:**
```diff
- import { dbQuery } from "../../../kernel/utils/safe-query";
+ import { dbQuery } from "../lib/safe-query";
```

---

### 2. REALTIME MANAGER API MISMATCH

**Files using non-existent `realtimeManager` methods:**

- `cockpit/lib/hooks/useRealtimeEconomics.ts` (lines 17, 18, 29)
- `cockpit/lib/hooks/useLock.ts` (lines 23, 39)
- `cockpit/lib/hooks/usePresence.ts` (uses methods)
- `cockpit/lib/hooks/useRealtimeProjects.ts` (uses methods)
- `cockpit/lib/hooks/useRealtimeTasks.ts` (uses methods)
- `cockpit/lib/hooks/useRealtimeTimer.ts` (uses methods)
- `cockpit/lib/collab/CollabProvider.tsx` (lines 47, 49, 72, 151, 172, 197, 203)

**Current `realtimeManager` API:**
```typescript
export const realtimeManager = {
  subscribe,
  triggerLocal,
};
```

**Required API (based on usage):**
- `initialize(tenantId, userId, userName): Promise<void>`
- `subscribeToTable(table, callback)`
- `subscribeToBroadcast(channel, callback)`
- `sendBroadcast(channel, payload)`
- `updatePresence(state)`

**Action:** Extend `cockpit/lib/realtime.ts` to implement full API.

**Diff Intent:**
```diff
export const realtimeManager = {
  subscribe,
  triggerLocal,
+ initialize: async (tenantId: string, userId: string, userName: string) => { /* ... */ },
+ subscribeToTable: (table: string, callback: Function) => { /* ... */ },
+ subscribeToBroadcast: (channel: string, callback: Function) => { /* ... */ },
+ sendBroadcast: (channel: string, payload: any) => { /* ... */ },
+ updatePresence: (state: any) => { /* ... */ },
};
```

---

### 3. TYPE NAME MISMATCHES

**Files using deprecated type names:**

- `cockpit/services/economics.ts` (line 4): `DBEconomicsModel`, `EconomicsModel`
- `cockpit/lib/hooks/useRealtimeEconomics.ts` (lines 6, 7, 20, 24, 31): `DBEconomicsModel`
- `cockpit/lib/supabase-mapper.ts`: `mapEconomicsModel`
- `cockpit/lib/store/economics.ts`: Likely uses old types

**Action:** Update to match `cockpit/lib/supabase-types.ts`:
- `DBEconomicsModel` → `DBEconomics`
- `EconomicsModel` → `Economics`
- `mapEconomicsModel` → `mapEconomics`

**Diff Intent:**
```diff
- import type { DBEconomicsModel, EconomicsModel } from "../lib/supabase-types";
+ import type { DBEconomics, Economics } from "../lib/supabase-types";
- import { mapEconomicsModel } from "../lib/supabase-mapper";
+ import { mapEconomics } from "../lib/supabase-mapper";
```

---

### 4. SERVER/CLIENT BOUNDARY VIOLATIONS

**Client components using server-only Supabase client:**

- `cockpit/components/ClientSelector.tsx` (line 4): Uses `@/services/supabase` which may be server-only

**Action:** Verify `cockpit/services/supabase.ts` exports client-safe instance, or create `cockpit/lib/supabase-client-browser.ts` for client components.

**Diff Intent:**
```diff
- import { supabase } from "@/services/supabase";
+ import { supabase } from "@/lib/supabase-client-browser";
```

---

### 5. NEXT.JS EXPERIMENTAL CONFIG

**Issue:** `partialPrerendering: true` in `cockpit/next.config.js` (line 5)

**Action:** Remove or disable if causing build issues.

**Diff Intent:**
```diff
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js", "react", "framer-motion"],
-   partialPrerendering: true,
  },
```

---

### 6. MISSING SUPABASE CLIENT EXPORTS

**Files may need client-safe Supabase instance:**

- `cockpit/components/ClientSelector.tsx`
- Any other client components using Supabase directly

**Action:** Ensure `cockpit/lib/supabase-client-browser.ts` exists and exports browser-safe client.

---

## EXECUTION ORDER

1. Create `cockpit/lib/safe-query.ts` (copy from kernel)
2. Update kernel imports → cockpit imports (4 files)
3. Extend `cockpit/lib/realtime.ts` with full API
4. Fix type names (DBEconomicsModel → DBEconomics, etc.)
5. Fix ClientSelector Supabase import
6. Remove partialPrerendering from next.config.js
7. Verify all imports resolve

---

## FILES TO MODIFY

1. `cockpit/lib/safe-query.ts` (CREATE)
2. `cockpit/lib/realtime.ts` (EXTEND)
3. `cockpit/services/economics.ts` (FIX IMPORTS + TYPES)
4. `cockpit/services/tasks.ts` (FIX IMPORTS)
5. `cockpit/services/projects.ts` (FIX IMPORTS)
6. `cockpit/services/vendors.ts` (FIX IMPORTS)
7. `cockpit/lib/hooks/useRealtimeEconomics.ts` (FIX TYPES + API)
8. `cockpit/lib/hooks/useLock.ts` (FIX API)
9. `cockpit/lib/hooks/usePresence.ts` (FIX API)
10. `cockpit/lib/hooks/useRealtimeProjects.ts` (FIX API)
11. `cockpit/lib/hooks/useRealtimeTasks.ts` (FIX API)
12. `cockpit/lib/hooks/useRealtimeTimer.ts` (FIX API)
13. `cockpit/lib/collab/CollabProvider.tsx` (FIX API)
14. `cockpit/lib/supabase-mapper.ts` (FIX FUNCTION NAME)
15. `cockpit/components/ClientSelector.tsx` (FIX IMPORT)
16. `cockpit/next.config.js` (REMOVE PARTIAL PRERENDERING)

---

**STATUS:** READY FOR PATCH APPLICATION

