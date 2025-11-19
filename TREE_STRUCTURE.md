# FractalOS System Tree Structure

```
fractal-os/
│
├── 📦 Root Configuration
│   ├── package.json                    # Workspace scripts (seed, migrate)
│   ├── migrate.ts                       # Database migration runner
│   ├── seed-fractalos.ts                # Database seeding script
│   ├── fractal.config.json             # FractalOS configuration
│   └── README.md                        # Project documentation
│
├── 🎯 cockpit-lite/                     # Next.js Frontend Application (Production)
│   ├── app/                             # Next.js App Router
│   │   ├── (routes)/                    # Route groups
│   │   │   ├── dashboard/               # Dashboard page
│   │   │   ├── projects/                # Projects pages
│   │   │   ├── tasks/                   # Tasks pages
│   │   │   ├── time/                    # Time tracking pages
│   │   │   ├── economics/               # Economics pages
│   │   │   ├── clients/                 # Clients pages
│   │   │   ├── tenants/                 # Tenants pages
│   │   │   └── t/[tenant]/              # Tenant-scoped routes
│   │   ├── api/                         # API Routes
│   │   │   ├── auth/                    # Authentication endpoints
│   │   │   ├── sync/                    # Sync endpoint
│   │   │   ├── telemetry/               # Telemetry endpoints
│   │   │   └── notion-sync/             # (Deprecated) Notion sync
│   │   ├── actions.ts                   # Server actions
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home page
│   │   ├── error.tsx                    # Global error boundary
│   │   └── globals.css                  # Global styles
│   │
│   ├── components/                      # React Components
│   │   ├── ClientSelector.tsx           # Client selection dropdown
│   │   ├── TaskList.tsx                 # Task list component
│   │   ├── TimeTracker.tsx              # Time tracking component
│   │   ├── EconomicsCharts.tsx          # Economics visualization
│   │   ├── ProjectsTable.tsx            # Projects table
│   │   ├── TimeEntryForm.tsx            # Time entry form
│   │   ├── Sidebar.tsx                  # Navigation sidebar
│   │   ├── GlassPanel.tsx               # Glass morphism UI component
│   │   ├── ErrorBoundary.tsx            # Error boundary component
│   │   ├── LoadingSkeleton.tsx          # Loading states
│   │   ├── EmptyState.tsx               # Empty state component
│   │   ├── SyncBanner.tsx               # Offline sync banner
│   │   ├── RealtimeProvider.tsx         # Realtime context provider
│   │   ├── SmartForm.tsx                # Dynamic form generator
│   │   ├── DynamicFields.tsx            # Dynamic field renderer
│   │   ├── CollabField.tsx              # Collaborative editing field
│   │   ├── LiveCursor.tsx               # Live cursor indicator
│   │   ├── LockIndicator.tsx            # Document lock indicator
│   │   ├── PresenceBar.tsx              # User presence bar
│   │   ├── PresenceIndicator.tsx        # User presence indicator
│   │   ├── TenantSwitcher.tsx           # Tenant switcher
│   │   ├── ThemeToggle.tsx              # Theme switcher
│   │   └── DarkModeToggle.tsx           # Dark mode toggle
│   │
│   ├── lib/                             # Core Libraries & Utilities
│   │   ├── supabase/                    # Supabase client & middleware
│   │   │   └── middleware.ts            # Auth middleware
│   │   ├── auth/                        # Authentication utilities
│   │   │   ├── user.ts                  # User auth helpers
│   │   │   └── tenant.ts                # Tenant auth helpers
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── useRealtimeTasks.ts      # Realtime tasks hook
│   │   │   ├── useRealtimeProjects.ts   # Realtime projects hook
│   │   │   ├── useRealtimeEconomics.ts  # Realtime economics hook
│   │   │   ├── useRealtimeTimer.ts      # Realtime timer hook
│   │   │   ├── usePresence.ts           # Presence hook
│   │   │   ├── useLock.ts               # Document locking hook
│   │   │   └── useCrossTabSync.ts       # Cross-tab sync hook
│   │   ├── store/                       # Zustand state stores
│   │   │   ├── tasks.ts                 # Tasks store
│   │   │   ├── projects.ts              # Projects store
│   │   │   ├── economics.ts             # Economics store
│   │   │   └── presence.ts              # Presence store
│   │   ├── collab/                      # Collaboration utilities
│   │   │   ├── CollabProvider.tsx       # Collaboration provider
│   │   │   ├── types.ts                 # Collaboration types
│   │   │   └── utils/colors.ts          # User color assignment
│   │   ├── actions/                     # Server actions
│   │   │   └── locks.ts                 # Document locking actions
│   │   ├── cache.ts                     # In-memory cache (TTL)
│   │   ├── offline.ts                   # IndexedDB offline cache (Dexie)
│   │   ├── realtime.ts                  # Supabase Realtime wrapper
│   │   ├── telemetry.ts                 # Telemetry & logging
│   │   ├── security.ts                  # Security guards
│   │   ├── access-control.ts            # RBAC helpers
│   │   ├── pagination.ts                # Pagination utilities
│   │   ├── relation-resolver.ts         # Foreign key resolver
│   │   ├── tenant.ts                    # Tenant context utilities
│   │   ├── env.ts                       # Environment validation
│   │   ├── data.ts                      # Data transformation
│   │   ├── supabase-client.ts           # Server Supabase client
│   │   ├── supabase-client-browser.ts   # Browser Supabase client
│   │   ├── supabase-mapper.ts           # Data mapping utilities
│   │   ├── supabase-schema.ts           # Schema definitions
│   │   ├── supabase-types.ts            # TypeScript types
│   │   ├── supabase.ts                  # Unified Supabase client
│   │   ├── types.ts                     # Shared types
│   │   ├── types_db.ts                  # Database types
│   │   └── notion.ts                    # (Deprecated) Notion stub
│   │
│   ├── services/                        # Business Logic Services
│   │   ├── supabase.ts                  # Unified Supabase service
│   │   ├── projects.ts                  # Projects service
│   │   ├── tasks.ts                     # Tasks service
│   │   ├── time.ts                      # Time entries service
│   │   ├── economics.ts                 # Economics service
│   │   ├── clients.ts                   # Clients service
│   │   ├── vendors.ts                   # Vendors service
│   │   ├── tenant.ts                    # Tenant service
│   │   ├── sync.ts                      # Offline sync service
│   │   ├── crossjoin.ts                 # Cross-table joins
│   │   ├── schema.ts                    # Schema types
│   │   ├── api.ts                       # API client
│   │   ├── notion.ts                    # (Deprecated) Notion stub
│   │   └── actions/                     # Server actions
│   │       ├── projects.ts              # Project actions
│   │       └── tasks.ts                 # Task actions
│   │
│   ├── layouts/                         # Layout Components
│   │   └── MainLayout.tsx               # Main application layout
│   │
│   ├── ui/                              # UI Theme & Components
│   │   └── theme.ts                     # Theme configuration
│   │
│   ├── styles/                          # Stylesheets
│   │   └── theme.css                    # Theme CSS variables
│   │
│   ├── middleware.ts                    # Next.js middleware (auth)
│   ├── next.config.js                   # Next.js configuration
│   ├── tailwind.config.js               # Tailwind CSS config
│   ├── postcss.config.js                # PostCSS config
│   ├── tsconfig.json                    # TypeScript config
│   ├── package.json                     # Dependencies
│   │
│   └── 📄 Documentation
│       ├── README.md                    # Cockpit Lite README
│       ├── BUILD_SUMMARY.md             # Build documentation
│       ├── API_CONTRACT.md              # API contract (frozen)
│       ├── SCHEMA_VERSION.md            # Schema version (frozen)
│       ├── LAUNCH_CHECKLIST.md          # Launch checklist
│       ├── UPGRADE_SUMMARY.md           # Upgrade notes
│       └── PHASE_24_SUMMARY.md          # Phase 24 implementation notes
│
├── 🎨 cockpit/                          # Legacy Frontend (Deprecated)
│   ├── components/                      # React components
│   ├── layouts/                         # Layout components
│   ├── pages/                           # Pages
│   ├── services/                        # Services
│   └── ui/                              # UI theme
│
├── 🧠 kernel/                           # Core Backend Kernel
│   ├── api/                             # API Handlers
│   │   ├── clients.api.ts               # Clients API
│   │   ├── projects.api.ts              # Projects API
│   │   ├── tasks.api.ts                # Tasks API
│   │   ├── time.api.ts                 # Time entries API
│   │   └── economics.api.ts            # Economics API
│   │
│   ├── auth/                            # Authentication
│   │   ├── login.ts                     # Login logic
│   │   └── token.ts                     # Token management
│   │
│   ├── boot/                            # Boot Sequence
│   │   ├── boot.ts                      # Kernel boot loader
│   │   └── kernel.logics.ts             # Kernel initialization
│   │
│   ├── commands/                        # Command Handlers
│   │   ├── index.ts                     # Command registry
│   │   ├── project.commands.ts          # Project commands
│   │   ├── task.commands.ts            # Task commands
│   │   └── economics.commands.ts        # Economics commands
│   │
│   ├── drizzle/                         # Drizzle ORM
│   │   ├── client.ts                    # Database client
│   │   ├── schema.ts                    # Database schema
│   │   └── migrations/                  # Database migrations
│   │       ├── 0001_init.sql
│   │       ├── 0002_rls_tenant.sql
│   │       └── 20251119_initial_supabase/
│   │
│   ├── schemas/                         # Data Schemas
│   │   ├── index.ts                     # Schema exports
│   │   ├── client.schema.ts             # Client schema
│   │   ├── project.schema.ts            # Project schema
│   │   ├── task.schema.ts               # Task schema
│   │   ├── time_entry.schema.ts         # Time entry schema
│   │   └── economics.schema.ts          # Economics schema
│   │
│   ├── patterns/                        # Pattern Engine
│   │   ├── index.ts                     # Pattern loader
│   │   └── base.pattern.json            # Base pattern definition
│   │
│   ├── manifests/                       # System Manifests
│   │   ├── index.ts                     # Manifest loader
│   │   ├── base.manifest.json           # Base manifest
│   │   └── sync.manifest.json           # Sync manifest
│   │
│   ├── events/                          # Event System
│   │   ├── index.ts                     # Event exports
│   │   ├── types.ts                     # Event types
│   │   ├── ingest.ts                    # Event ingestion
│   │   └── normalize.ts                 # Event normalization
│   │
│   ├── workers/                         # Background Workers
│   │   ├── realtime.worker.ts           # Realtime worker
│   │   └── state.ts                     # Worker state
│   │
│   ├── etl/                             # ETL Pipeline
│   │   └── etl.engine.ts                 # ETL engine
│   │
│   ├── db/                              # Database Utilities
│   │   └── write.ts                     # Write operations
│   │
│   ├── utils/                           # Utilities
│   │   ├── helpers.ts                   # General helpers
│   │   ├── validation.ts                # Validation utilities
│   │   ├── pattern.helpers.ts           # Pattern helpers
│   │   ├── notion.adapter.ts            # Notion adapter
│   │   ├── notion.etl.ts                # Notion ETL
│   │   ├── supabase.client.ts           # Supabase client
│   │   ├── tenant.ts                    # Tenant utilities
│   │   ├── identity.ts                  # Identity utilities
│   │   ├── api-middleware.ts            # API middleware
│   │   └── safe-query.ts                # Safe query builder
│   │
│   └── index.ts                         # Kernel entry point
│
├── 🤖 agents/                           # AI Agent System
│   ├── runner.ts                        # Agent runner
│   ├── agent.types.ts                   # Agent type definitions
│   ├── context.loader.ts                # Context loading
│   ├── prompts/                         # Agent prompts
│   │   └── index.md                     # Main prompt
│   ├── registry/                        # Command Registry
│   │   ├── index.ts                     # Registry loader
│   │   └── commands.json                # Command definitions
│   ├── tools/                           # Agent Tools
│   │   ├── index.ts                     # Tool exports
│   │   ├── projectTools.ts              # Project tools
│   │   └── taskTools.ts                 # Task tools
│   └── workflows/                       # Workflow Definitions
│       └── pattern.workflow.json        # Pattern workflow
│
├── 📊 supabase/                         # Supabase Backend
│   ├── migrations/                      # Database Migrations
│   │   ├── 0002_tenanting.sql           # Multi-tenant structure
│   │   ├── 0002_multi_tenant_structure.sql
│   │   ├── 0003_rls_policies.sql        # Row-level security
│   │   ├── 0004_auth_jwt_claims.sql     # JWT claims
│   │   ├── 0005_model_x_tenanting.sql   # Model-X tenanting
│   │   ├── 0006_model_x_rls_policies.sql
│   │   ├── 0007_phase17_rls.sql         # Phase 17 RLS
│   │   ├── 0008_phase18_identity_graph.sql
│   │   ├── 0009_editing_locks.sql       # Document locking
│   │   ├── 0010_performance_indexes.sql # Performance indexes
│   │   ├── 0011_phase10_rls.sql         # Phase 10 RLS
│   │   └── 0012_audit_logs.sql          # Audit logging
│   │
│   ├── functions/                       # Edge Functions
│   │   ├── sync-daily/                  # Daily sync function
│   │   │   ├── index.ts
│   │   │   └── logic.ts
│   │   └── sync-hourly/                 # Hourly sync function
│   │       ├── index.ts
│   │       └── logic.ts
│   │
│   ├── policies/                        # RLS Policies
│   │   └── tenant_rls.sql               # Tenant RLS policies
│   │
│   ├── realtime/                        # Realtime Configuration
│   │   └── listener.ts                  # Realtime listener
│   │
│   └── seed.sql                         # Database seed data
│
├── 📦 modules/                          # Domain Modules
│   ├── automation/                      # Automation module
│   │   ├── index.ts
│   │   └── flows.json                   # Automation flows
│   ├── content/                         # Content module
│   ├── crm/                             # CRM module
│   │   └── models.json                  # CRM models
│   ├── finance/                         # Finance module
│   │   ├── index.ts
│   │   └── models.json                  # Finance models
│   ├── manufacturing/                   # Manufacturing module
│   │   ├── index.ts
│   │   └── patterns.json               # Manufacturing patterns
│   └── web/                             # Web module
│       ├── index.ts
│       └── patterns.json                # Web patterns
│
├── 🔧 scripts/                          # Utility Scripts
│   ├── cli/                             # CLI Tools
│   │   └── fractal.ts                  # Fractal CLI
│   ├── setup/                           # Setup Scripts
│   │   ├── init.sh                      # Initialization
│   │   ├── migrate.sh                   # Migration script
│   │   ├── migrate-supabase.sh          # Supabase migration
│   │   └── seed.sh                      # Seed script
│   ├── deploy/                          # Deployment Scripts
│   │   └── push.sh                      # Deployment push
│   └── maintenance/                    # Maintenance Scripts
│       ├── healthcheck.ts               # Health check (TS)
│       └── healthcheck.js               # Health check (JS)
│
├── 📚 docs/                             # Documentation
│   ├── architecture/                    # Architecture Docs
│   │   ├── 01_architecture_overview.md
│   │   ├── 02_phase_timeline.md
│   │   ├── 03_kernel_structure.md
│   │   ├── 04_pattern_engine.md
│   │   ├── 05_economics_engine.md
│   │   ├── 06_semantic_memory.md
│   │   ├── 07_agents_layer.md
│   │   └── 08_cockpit_architecture.md
│   ├── api/                             # API Documentation
│   ├── blueprints/                      # Blueprints
│   ├── config/                          # Configuration Docs
│   ├── modules/                         # Module Documentation
│   └── patterns/                        # Pattern Documentation
│
├── 🌐 frontend/                         # Legacy Frontend (Deprecated)
│   ├── app/                             # Next.js app
│   ├── public/                          # Static assets
│   └── package.json
│
├── 🔄 queue/                            # Event Queue
│   ├── events.ts                        # Event definitions
│   └── types.ts                         # Queue types
│
└── 👷 workers/                          # Background Workers
    └── sync/                            # Sync Workers
        └── [6 TypeScript files]         # Sync worker implementations
```

## Key System Components

### 🎯 **cockpit-lite/** - Production Frontend
- **Next.js 14** App Router application
- **Supabase** for backend (auth, database, realtime)
- **Offline-first** with IndexedDB caching
- **Real-time collaboration** with presence & locks
- **Multi-tenant** architecture

### 🧠 **kernel/** - Core Backend
- Command handlers for business logic
- Pattern engine for extensibility
- Event system for async processing
- Drizzle ORM for database operations

### 📊 **supabase/** - Database & Backend
- **12 migrations** for schema evolution
- **RLS policies** for multi-tenant security
- **Edge functions** for scheduled tasks
- **Seed data** for development

### 🤖 **agents/** - AI Agent System
- Agent runner for autonomous operations
- Tool registry for agent capabilities
- Workflow definitions for complex tasks

### 📦 **modules/** - Domain Modules
- Extensible modules for different domains
- Patterns and models per module
- Pluggable architecture

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **ORM**: Drizzle ORM
- **State**: Zustand
- **Offline**: Dexie (IndexedDB)
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel (frontend), Supabase (backend)

