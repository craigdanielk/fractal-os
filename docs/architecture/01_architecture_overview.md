

# FractalOS: System Architecture Overview
Version: 1.0  
Model: Mono-Kernel + Modules  
Lifecycle: 30–40 month viability  
Maintenance: 6–11 hours per month  
Efficiency Impact: 25–32 %

## 1. System Model
FractalOS is an Internal Developer Platform (IDP) engineered around:

• A deterministic Kernel  
• A modular Pattern Engine  
• Declarative manifests  
• Blueprint + repo scaffolding system  
• Economics & Contribution Engine  
• Semantic workspace memory (optional)  
• Cockpit front-end for operations  
• Industry-specific modules

Not a SaaS product — but a deployable operational methodology.

## 2. Major Layers

### 2.1 Kernel
The Kernel provides:

• Drizzle-schema source of truth  
• Manifest parsing + validation  
• Boot process  
• Environment loader  
• Pattern index  
• Command registry for agents  
• Shared utilities  
• Repo bootstrap logic  

Core dirs: `kernel/schemas`, `kernel/manifests`, `kernel/patterns`

### 2.2 Cockpit
Operational UI layer:

• Today/Weekly views  
• Task/time management  
• Economics dashboards  
• Pattern engine UI  
• Build dashboards  
• Project insights

Interfaces via REST endpoints.

### 2.3 Agents
Deterministic assistants:

• Tool registry  
• MCP-compatible commands  
• Workflow templates  
• Prompt packs  
• No recursion  

Used for blueprint generation, scaffolding, documentation, and automation.

### 2.4 Modules
Domain packs:

• Web (Shopify/Next.js)  
• Automation  
• Finance  
• Manufacturing  
• CRM  
• Content  

Each module is versioned, isolated, optional.

### 2.5 Economics & Contribution Engine
Delivers viability insights:

• Cost-to-company  
• Revenue per project  
• Contribution per employee  
• Margin per job  
• Client-level ROI  

A core commercial value-driver.

### 2.6 Semantic Workspace Memory
Optional, high-leverage:

• pgvector embeddings  
• Pre-warmed context caches  
• Project memory  
• Rehydration for agents  

Saves 4–7 hours/week in high-volume workflows.

## 3. Data Model
Core tables:

• users  
• clients  
• projects  
• tasks  
• time_entries  
• manifests  
• economics_* tables  
• pattern_definitions  
• pattern_instances  
• module_registry  

## 4. Mandatory Architectural Constraints
• Everything is declarative  
• Schema-first design  
• Manifest-driven workflows  
• Deterministic boot sequence  
• Escape-hatch decoupling from Supabase  
• Patterns/modules fully isolated  
• Blueprint generator as the only repo creation path  
• Cockpit never mutates schema  
• Kernel does not depend on Cockpit

## 5. Execution Flow

### 5.1 Task + Time Flow
UI → /api/tasks → Kernel → DB → Economics Engine

### 5.2 Pattern Engine Flow
Pattern select → blueprint generator → repo scaffolding → manifest commit

### 5.3 Economics Flow
time_entries + cost tables → economics_view → contribution dashboards

### 5.4 Module Flow
module registry → module patterns → manifest generation → blueprint

## 6. Longevity & Maintenance
• Drizzle as true source of truth  
• GitOps-based reconstruction  
• Schema drift detection  
• Modular versioning  
• 30–40 month lifecycle before required overhaul