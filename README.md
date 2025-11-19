# FractalOS  
Deterministic Multi‑Client Workstation (v0.1.0)

FractalOS is a modular, deterministic operating environment designed for high‑volume multi‑project technical operators.  
It provides a reproducible kernel, declarative manifests, pattern inheritance, economics engine, agent layer, and a cockpit‑based UI for daily execution.

This repository represents the lightweight foundational build (Phase 0–1) intended for:

- Solo operators
- Small agencies
- Multi‑brand e‑commerce / dev studios
- High‑throughput technical workflows

---

## Core Structure

### Kernel
The Kernel is the deterministic core of FractalOS and houses:
- Boot logic  
- Manifests  
- Patterns  
- Schemas  
- Commands  
- Drizzle ORM schema + migrations  
- Shared utilities  

The Kernel exposes a stable API that all modules, agents, and cockpit surfaces consume.

---

### Agents
Agents provide deterministic, non‑autonomous operations:
- Command registry  
- Tools  
- Workflows  
- Prompt manifests  

Agents never write to the database directly; they invoke kernel commands and API endpoints only.

---

### API
Typed Supabase/Drizzle‑aligned service endpoints:
- tasks  
- projects  
- time entries  
- economics  

These files form the contract between Kernel logic and the Cockpit UI.

---

### Cockpit
The human‑in‑the‑loop execution layer:
- Pages (dashboard, tasks, time, economics)
- Components (lists, charts, forms)
- Layouts
- Services
- UI theme

The cockpit enforces the deterministic workflow and ensures visibility into time, cost, and contribution.

---

### Modules
Feature‑layer packages representing vertical domains:
- automation  
- crm  
- finance  
- manufacturing  
- web  

Modules extend Kernel patterns and expose manifest‑driven behaviours.

---

## Scripts

### CLI
`fractal.ts` — command‑line utilities for initializing, scaffolding, and inspecting the system.

### Deploy
`push.sh` — deploy to Supabase/Fly.io/desired environment.

### Setup
`init.sh` and `migrate.sh` — local environment initialization and database migrations.

### Maintenance
`healthcheck.js` — structural validation for the repo.

---

## Config
`fractal.config.json` defines all system paths and module registry.

---

## Status
This is the Phase 0/1 baseline.  
Phase 2 introduces:
- Full economics engine integration  
- Pattern engine expansion  
- Notion/R17 adapters  
- Extended agent workflows  
- Cockpit experience refinement  

---

## License
All rights reserved. Distribution prohibited without explicit written permission from the author.
