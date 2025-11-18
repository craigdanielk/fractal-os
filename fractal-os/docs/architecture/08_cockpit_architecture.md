

# FractalOS Cockpit Architecture

The Cockpit is the primary user interface of FractalOS. It provides unified navigation, task and time management, economics insights, blueprint integration, module controls, and multi-project operations. It is intentionally thin, entirely declarative, and fully dependent on the Kernel for logic.

---

## 1. Purpose of the Cockpit

The Cockpit exists to:

- centralise operations in a single UI  
- provide daily and weekly execution views  
- surface economics and contribution insights  
- visualise project, client, and module performance  
- integrate semantic memory for rapid context switching  
- support blueprint workflows  
- deliver a consistent experience across industries  

The Cockpit is the single pane of glass for FractalOS.

---

## 2. Architectural Principles

- **Kernel-first**: The Cockpit contains no business logic.  
- **Schema-driven**: All views map directly to Kernel schemas.  
- **Manifest-bound**: Enabled features depend on the project manifest.  
- **Pattern-aware**: The Cockpit reacts dynamically to activated patterns.  
- **Modular**: Each UI section corresponds to a module or schema.  
- **Deterministic**: No local state beyond UI interactions.  
- **Stateless API calls**: All state resides in the Kernel/Supabase.  
- **Extensible**: New modules add new pages, not rewrite old ones.  

---

## 3. Cockpit Directory Layout

```
cockpit/
  pages/
    dashboard.tsx
    tasks.tsx
    time.tsx
    economics.tsx
  components/
    TaskList.tsx
    TimeEntryForm.tsx
    EconomicsCharts.tsx
  layouts/
    MainLayout.tsx
  services/
    api.ts
  ui/
    theme.ts
  assets/
```

Each part has a single responsibility.

---

## 4. Cockpit Data Flow

1. User interacts with Cockpit  
2. Cockpit calls `/api/*` routes  
3. Kernel receives and validates input  
4. Kernel executes deterministic logic  
5. Database writes occur  
6. Kernel returns structured output  
7. Cockpit renders result  

The Cockpit never computes business logic — it only displays it.

---

## 5. Pages Overview

### 5.1 Dashboard
- High-level view of all active projects  
- Summary of today and week  
- Semantic memory-driven recommendations  
- Alerts for economics thresholds  

### 5.2 Tasks Page
- Create, update, and complete tasks  
- Filter by client, project, pattern, or module  
- View dependencies and stage flow  

### 5.3 Time Page
- Log time per task/project  
- View weekly distribution  
- Feed raw data into Economics Engine  

### 5.4 Economics Page
- Contribution per project  
- Cost vs revenue breakdown  
- Client-level profitability  
- Weekly and monthly summaries  
- Alerts for low-margin tasks  

---

## 6. Components

### TaskList.tsx  
Renders lists of tasks with filtering and grouping.

### TimeEntryForm.tsx  
Provides structured time logging with validation.

### EconomicsCharts.tsx  
Displays economics data using declarative chart components.

---

## 7. Layout System

`MainLayout.tsx` defines:

- navigation  
- global styling  
- breadcrumb rendering  
- workspace title/state  
- module toggles  

Layouts remain minimal and purely presentational.

---

## 8. Services Layer

`services/api.ts` provides typed fetch wrappers.

Functions include:

- `getTasks()`  
- `logTime()`  
- `getEconomicsOverview()`  
- `getProjectDetails()`  
- `getPatterns()`  
- `getModules()`  

All services are strongly typed and auto-generated from Kernel schemas.

---

## 9. Theme Layer

`ui/theme.ts` defines:

- typography  
- spacing  
- colours  
- light/dark surface rules  
- component tokens  

Theme must be brand-neutral and module-neutral.

---

## 10. Extensibility Model

New modules (e.g., manufacturing, automation, CRM) add new pages:

```
cockpit/pages/manufacturing.tsx
cockpit/pages/automation.tsx
cockpit/pages/crm.tsx
```

Pages bind automatically to:

- manifest settings  
- economics models  
- patterns  
- Kernel API endpoints  

No rewrite required for existing Cockpit code.

---

## 11. Integrity Rules

- The Cockpit must never modify schemas  
- It must never compute economics or pattern logic  
- All logic resides in the Kernel  
- Cockpit retrieves → displays → updates via API  
- Semantic memory is read-only for the Cockpit  
- All heavy lifting is done by Kernel + Agents  

The Cockpit is the interface, not the engine.