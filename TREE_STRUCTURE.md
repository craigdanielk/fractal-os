# FractalOS Repository Tree Structure

**Generated:** 2024-11-20 (Updated)  
**Depth:** 8 levels  
**Exclusions:** node_modules, .git

---

## Repository Root Structure

```
fractal-os/
├── agents/                          # AI Agent Layer
│   ├── agent.types.ts
│   ├── context.loader.ts
│   ├── prompts/
│   │   └── index.md
│   ├── registry/
│   │   ├── commands.json
│   │   └── index.ts
│   ├── runner.ts
│   ├── tools/
│   │   ├── index.ts
│   │   ├── projectTools.ts
│   │   └── taskTools.ts
│   └── workflows/
│       └── pattern.workflow.json
│
├── cockpit/                         # Frontend UI Application
│   ├── API_CONTRACT.md
│   ├── app/                         # Next.js App Router
│   │   ├── actions.ts
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── callback/
│   │   │   │   │   └── route.ts
│   │   │   │   └── session/
│   │   │   │       └── route.ts
│   │   │   ├── sync/
│   │   │   │   └── route.ts
│   │   │   ├── telemetry/
│   │   │   │   ├── action/
│   │   │   │   │   └── route.ts
│   │   │   │   └── error/
│   │   │   │       └── route.ts
│   │   │   └── tenants/
│   │   ├── clients/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── economics/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   ├── TasksClient.tsx
│   │   │   └── TasksPageClient.tsx
│   │   ├── tenants/
│   │   ├── time/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── TimeClient.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                  # React Components
│   │   ├── Brand.tsx
│   │   ├── ClientSelector.tsx
│   │   ├── CollabField.tsx
│   │   ├── DarkModeToggle.tsx
│   │   ├── DynamicFields.tsx
│   │   ├── EconomicsCharts.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FieldEditors.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── LiveCursor.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── LockIndicator.tsx
│   │   ├── MiniGantt.tsx
│   │   ├── NavLink.tsx
│   │   ├── PresenceBar.tsx
│   │   ├── PresenceIndicator.tsx
│   │   ├── ProjectsTable.tsx
│   │   ├── RealtimeProvider.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SmartForm.tsx
│   │   ├── SyncBanner.tsx
│   │   ├── TaskList.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TimeEntryForm.tsx
│   │   ├── TimeTracker.tsx
│   │   └── Topbar.tsx
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── lib/                         # Library Code
│   │   ├── actions/
│   │   │   └── locks.ts
│   │   ├── auth/
│   │   │   ├── identity.ts
│   │   │   └── user.ts
│   │   ├── collab/
│   │   │   ├── CollabProvider.tsx
│   │   │   ├── types.ts
│   │   │   └── utils/
│   │   │       └── colors.ts
│   │   ├── hooks/
│   │   │   ├── useCrossTabSync.ts
│   │   │   ├── useLock.ts
│   │   │   ├── usePresence.ts
│   │   │   ├── useRealtimeEconomics.ts
│   │   │   ├── useRealtimeProjects.ts
│   │   │   ├── useRealtimeTasks.ts
│   │   │   └── useRealtimeTimer.ts
│   │   ├── schemas/
│   │   │   ├── clients.ts
│   │   │   ├── economics.ts
│   │   │   ├── projects.ts
│   │   │   ├── tasks.ts
│   │   │   └── time.ts
│   │   ├── store/
│   │   │   ├── economics.ts
│   │   │   ├── presence.ts
│   │   │   ├── projects.ts
│   │   │   └── tasks.ts
│   │   ├── supabase/
│   │   │   └── middleware.ts
│   │   ├── auth.ts
│   │   ├── cache.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── notion.ts
│   │   ├── offline.ts
│   │   ├── pagination.ts
│   │   ├── realtime.ts
│   │   ├── relation-resolver.ts
│   │   ├── safe-query.ts
│   │   ├── security.ts
│   │   ├── service-wrapper.ts
│   │   ├── supabase-client-browser.ts
│   │   ├── supabase-client-server.ts
│   │   ├── supabase-client.ts
│   │   ├── supabase-mapper.ts
│   │   ├── supabase-schema.ts
│   │   ├── supabase-types.ts
│   │   ├── supabase.ts
│   │   ├── telemetry.ts
│   │   └── types.ts
│   ├── services/                    # Service Layer
│   │   ├── actions/
│   │   │   ├── projects.ts
│   │   │   └── tasks.ts
│   │   ├── api.ts
│   │   ├── clients.ts
│   │   ├── crossjoin.ts
│   │   ├── economics.ts
│   │   ├── notion.ts
│   │   ├── projects.ts
│   │   ├── schema.ts
│   │   ├── supabase.ts
│   │   ├── sync.ts
│   │   ├── tasks.ts
│   │   ├── time.ts
│   │   └── vendors.ts
│   ├── styles/
│   │   ├── FractalOS Deterministic Execution Matrix/
│   │   └── theme.css
│   ├── ui/
│   │   └── theme.ts
│   ├── middleware.ts
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── [various .md documentation files]
│
├── cockpit-lite/                    # Lightweight Cockpit Variant
│   └── next.config.js
│
├── docs/                           # Documentation
│   ├── api/
│   ├── architecture/
│   │   └── [8 markdown files]
│   ├── blueprints/
│   ├── config/
│   ├── modules/
│   └── patterns/
│
├── fractal/                        # Fractal Build System
│   └── build_master/                # Master Build Layer
│       ├── config.json
│       ├── docs/
│       │   └── roadmap_human.md
│       ├── HDO_DSL_ENCODED_ROADMAP.md  # ⭐ FSPEC Roadmap
│       └── wave/
│           └── WAVE_MASTER.dsl      # ⭐ Master DSL Build File
│
├── fractal-state/                  # System State
│   └── FractalOS_STATE_LOG.md
│   └── workspace.json              # (auto-created on first run)
│   └── logs/                       # (auto-created by runtime.ts)
│       └── runtime.log             # (auto-created on first run)
│
├── kernel/                         # Backend Kernel
│   ├── api/
│   │   ├── clients.api.ts
│   │   ├── economics.api.ts
│   │   ├── projects.api.ts
│   │   ├── tasks.api.ts
│   │   └── time.api.ts
│   ├── auth/
│   │   ├── login.ts
│   │   └── token.ts
│   ├── boot/
│   │   ├── boot.ts
│   │   └── kernel.logics.ts
│   ├── commands/
│   │   ├── economics.commands.ts
│   │   ├── index.ts
│   │   ├── project.commands.ts
│   │   └── task.commands.ts
│   ├── db/
│   │   └── write.ts
│   ├── env/
│   │   └── [.sample file]
│   ├── etl/
│   │   └── [1 file]
│   ├── events/
│   │   └── [4 files]
│   ├── manifests/
│   │   └── [3 files: 2 JSON, 1 TS]
│   ├── patterns/
│   │   └── [2 files: 1 JSON, 1 TS]
│   ├── schemas/
│   │   └── [6 TypeScript files]
│   ├── utils/
│   │   └── [8 TypeScript files]
│   ├── workers/
│   │   └── [2 files]
│   └── index.ts
│
├── modules/                        # Feature Modules
│   ├── automation/
│   │   └── [2 files: 1 JSON, 1 TS]
│   ├── content/
│   ├── crm/
│   │   └── [1 JSON file]
│   ├── finance/
│   │   └── [2 files: 1 JSON, 1 TS]
│   ├── manufacturing/
│   │   └── [2 files: 1 JSON, 1 TS]
│   └── web/
│       └── [2 files: 1 JSON, 1 TS]
│
├── queue/                          # Queue System
│   ├── events.ts
│   └── types.ts
│
├── scripts/                        # Build & Utility Scripts
│   ├── cli/
│   │   └── fractal.ts              # ⭐ Main CLI Entry Point
│   ├── deploy/
│   │   └── push.sh
│   ├── maintenance/
│   │   ├── healthcheck.js
│   │   └── healthcheck.ts
│   ├── orchestrator/               # ⭐ Orchestrator Core
│   │   ├── index.ts                # Main orchestrator entry
│   │   ├── ir.ts                   # Intermediate Representation
│   │   ├── runtime.ts              # Runtime graph builder
│   │   ├── cockpit.ts              # Cockpit Lite server
│   │   ├── state.ts                 # State management
│   │   ├── hotreload.ts            # Hot reload support
│   │   └── orchestrator.fractal    # Legacy fractal file
│   ├── setup/
│   │   ├── init.sh
│   │   ├── migrate-supabase.sh
│   │   ├── migrate.sh
│   │   └── seed.sh
│   └── verify-env.ts
│
├── supabase/                       # Supabase Configuration
│   ├── config.toml
│   ├── functions/
│   │   └── [4 TypeScript files]
│   ├── migrations/
│   │   └── [9 SQL migration files]
│   ├── policies/
│   │   └── [1 SQL file]
│   ├── realtime/
│   │   └── [1 TypeScript file]
│   └── seed.sql
│
├── workers/                        # Background Workers
│   └── sync/
│       └── [6 TypeScript files]
│
├── package.json                    # Root Package Configuration
├── fractal.config.json             # Fractal Configuration
├── SYSTEM_SCAN_REPORT.md           # ⭐ System Scan Report
├── SYSTEM_STATUS_REPORT.md         # ⭐ System Status Report
├── TREE_STRUCTURE.md               # ⭐ This File
└── [various other documentation files]
```

---

## Critical Path Files

### Orchestrator Files (scripts/orchestrator/)
- ✅ `index.ts` - Main orchestrator entry point
- ✅ `ir.ts` - DSL Intermediate Representation parser
- ✅ `runtime.ts` - Runtime graph builder (auto-creates logs directory)
- ✅ `cockpit.ts` - Cockpit Lite HTTP server (auto-creates state directory)
- ✅ `state.ts` - Workspace state management (auto-creates state directory)
- ✅ `hotreload.ts` - Hot reload support

### Master Build Files (fractal/build_master/)
- ✅ `wave/WAVE_MASTER.dsl` - Master DSL build specification
- ✅ `config.json` - Build configuration
- ✅ `HDO_DSL_ENCODED_ROADMAP.md` - Encoded roadmap (FSPEC)

### CLI Files (scripts/cli/)
- ✅ `fractal.ts` - CLI entry point

### State Files (fractal-state/)
- ✅ `FractalOS_STATE_LOG.md` - System state log
- ⚠️ `workspace.json` - Will be created on first run
- ⚠️ `logs/runtime.log` - Will be created on first run (directory auto-created by runtime.ts)

---

## Architecture Changes

### Removed Components
- ❌ `scripts/phases/` - **REMOVED** (migration to single-wave mode)
  - Previous: 10 wave directories with 7 phase files each (70 files total)
  - Current: Single DSL-driven architecture

### New Architecture
- ✅ Single-wave DSL mode active
- ✅ Build logic centralized in `WAVE_MASTER.dsl`
- ✅ FSPEC path corrected and validated

---

## Directory Statistics

- **Total Directories:** ~150+
- **Total Files:** ~500+ (excluding node_modules)
- **Orchestrator Files:** 7 files
- **Phase Files:** 0 files (migrated to DSL)
- **Cockpit Components:** 30+ React components
- **Kernel Modules:** 50+ TypeScript files
- **Supabase Migrations:** 9 SQL files

---

## Key Architectural Layers

1. **Orchestrator Layer** (`scripts/orchestrator/`)
   - DSL parsing and IR generation
   - Runtime graph construction
   - State management (auto-initialization)
   - Cockpit Lite server (auto-initialization)

2. **Build Master Layer** (`fractal/build_master/`)
   - Master DSL specification (`WAVE_MASTER.dsl`)
   - Build configuration
   - Roadmap documentation (FSPEC)

3. **Cockpit Layer** (`cockpit/`)
   - Next.js application
   - React components
   - Service layer
   - Supabase integration

4. **Kernel Layer** (`kernel/`)
   - API endpoints
   - Business logic
   - Command handlers
   - Event system

5. **Agent Layer** (`agents/`)
   - AI agent workflows
   - Tool definitions
   - Context loaders

---

## Verification Checklist

- ✅ Orchestrator files present in `scripts/orchestrator/`
- ✅ WAVE_MASTER.dsl present in `fractal/build_master/wave/`
- ✅ FSPEC present and path corrected (`HDO_DSL_ENCODED_ROADMAP.md`)
- ✅ CLI entry point present (`scripts/cli/fractal.ts`)
- ✅ State directory present (`fractal-state/`)
- ✅ Runtime and state files will be auto-created on first run
- ✅ All critical paths validated
- ✅ Single-wave architecture migration complete
- ✅ Phase files directory removed (architecture change)

---

## Changes Since Last Tree Structure

1. **Removed:** `scripts/phases/` directory (70 phase files)
2. **Architecture:** Migrated to single-wave DSL mode
3. **FSPEC:** Path corrected in code and validated
4. **Auto-initialization:** Runtime and state directories auto-created

---

**End of Tree Structure Report**
