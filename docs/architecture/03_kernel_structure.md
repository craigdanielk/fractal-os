

# FractalOS Kernel Structure

The Kernel is the deterministic core of FractalOS. It defines schemas, manifests, patterns, environment logic, and the system boot sequence. It is the single source of truth and the root of all higher‑level modules.

---

## 1. Kernel Responsibilities

The Kernel provides:

- Drizzle Source‑of‑Truth schema  
- Manifest parsing, validation, and normalization  
- Deterministic boot sequence  
- Environment configuration loading  
- Pattern registry and inheritance logic  
- Kernel command handlers  
- Shared utilities  
- Module binding points  
- Logging and error semantics  

The Kernel must remain pure, portable, and decoupled from any UI implementation.

---

## 2. Kernel Directory Layout

```
kernel/
  index.ts
  boot/
    boot.ts
    kernel.logics.ts
  env/
    env.sample
  schemas/
    index.ts
    task.schema.ts
    project.schema.ts
    client.schema.ts
    time_entry.schema.ts
    economics.schema.ts
  manifests/
    base.manifest.json
  patterns/
    index.ts
    base.pattern.json
  commands/
    index.ts
    task.commands.ts
    project.commands.ts
    economics.commands.ts
  utils/
    helpers.ts
```

---

## 3. Boot Process

### 3.1 Sequence Overview

1. Load environment variables  
2. Load and validate schema map  
3. Register patterns  
4. Load manifest definitions  
5. Initialize command registry  
6. Expose Kernel interface to Cockpit + Agents  

### 3.2 Deterministic Constraints

- Boot must not read from Cockpit.  
- Boot must not mutate schema structure.  
- Boot must not pull remote data.  
- Boot must validate manifests before activation.

---

## 4. Schemas (Drizzle SoT)

All data definitions originate in `kernel/schemas`.

Each schema must be:

- Strongly typed  
- Documented  
- Versioned  
- Backed by a migration  
- Referenced by the manifest system  
- Exposed to the Economics Engine  

Schemas define:

- users  
- clients  
- projects  
- tasks  
- time entries  
- economics tables  
- pattern definitions  
- module registry  

---

## 5. Manifest System

Manifests convert business logic into deterministic configuration.

A manifest can define:

- project metadata  
- module selection  
- required patterns  
- economics configuration  
- automation hooks  
- cockpit views to enable  
- blueprint seed data  

The Kernel must validate every manifest before usage.

---

## 6. Pattern Engine Binding Points

The Kernel does not implement the pattern engine.  
It exposes hooks used by the pattern engine in Phase 2:

- `registerPattern()`  
- `resolvePattern()`  
- `inheritPattern()`  
- `listPatterns()`  

These hooks allow the blueprint generator to safely construct new repos.

---

## 7. Command Registry

Commands expose safe, deterministic operations to agents.

Examples:

- `createTask()`  
- `updateProject()`  
- `computeEconomics()`  
- `applyPattern()`  

Commands are pure, typed, and must return predictable results.

---

## 8. Utilities

`kernel/utils/helpers.ts` contains:

- pure transformation functions  
- validators  
- shared parsers  
- date/time helpers  
- formatting operations  

No side effects, no external dependencies.

---

## 9. Kernel Integrity Rules

The Kernel must:

- remain UI‑agnostic  
- remain module‑agnostic  
- remain agent‑agnostic  
- avoid circular dependencies  
- avoid dynamic schema mutation  
- avoid implicit recursion  

The Kernel is the stable anchor of FractalOS and the foundation for its 30–40 month lifecycle.
