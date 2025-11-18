

# FractalOS Semantic Memory & Context Engine

The Semantic Memory Layer provides long-term context persistence, fast context rehydration, and high‑efficiency switching between projects, clients, and modules. It is optional but delivers 4–7 hours/week in productivity gains for high‑volume operators.

---

## 1. Purpose of Semantic Memory

The Context Engine enables FractalOS to:

- Maintain project memory beyond active sessions  
- Support multi-project workflows  
- Reduce context-loading time  
- Improve agent performance  
- Perform cross-project reasoning  
- Surface relevant historical data instantly  
- Enable intelligent search and retrieval  

It functions as a unified semantic layer over operational data.

---

## 2. Core Responsibilities

- Generate embeddings for tasks, projects, manifests, modules, patterns, and economics data  
- Store semantic vectors using `pgvector`  
- Provide fast nearest-neighbour lookup  
- Rehydrate Cockpit and Agent context  
- Maintain deterministic memory snapshots  
- Build project‑level memory caches  
- Enable cross‑project linking and insights  

---

## 3. Semantic Memory Architecture

### 3.1 Components

- **Vector store** (pgvector)  
- **Embedding generator** (LLM-driven)  
- **Memory snapshotter** (deterministic)  
- **Warm cache layer**  
- **Context stitching layer**  
- **Cross‑project search engine**  

### 3.2 Data Types Embedded

- Tasks  
- Project descriptions  
- Client metadata  
- Manifests  
- Pattern definitions  
- Economics summaries  
- Modules and module outputs  
- Blueprints  
- Documentation snippets  

Each object becomes a vector with metadata references.

---

## 4. Memory Pipeline

### 4.1 Ingestion Step

Triggered when:

- A task is created or updated  
- A project changes state  
- A manifest is modified  
- A blueprint is applied  
- A pattern is updated  
- Economics results are recalculated  

The pipeline generates embeddings and stores them.

### 4.2 Rehydration Step

Used by:

- Cockpit (when switching views)  
- Agents (during tasks like generation or refactoring)  

Pulls:

- nearest neighbours  
- related tasks  
- historical work  
- relevant patterns  
- recent economics data  

### 4.3 Cache Warming

Pre‑loads vector clusters for:

- daily active projects  
- top clients  
- recurring modules  
- ongoing blueprints  

This enables sub‑second switching inside Cockpit.

---

## 5. Cross‑Project Intelligence

Semantic memory enables:

- detecting recurring issues across clients  
- identifying repeating workflows  
- surfacing relevant modules  
- finding similar patterns  
- learning which economics models perform best  
- powering multi‑industry insights  

This transforms FractalOS into a pattern‑recognition engine.

---

## 6. Agent Integration

Agents receive enriched context:

- distilled summaries  
- semantic neighbours  
- recent work snapshots  
- manifest‑based reasoning  
- module‑specific memory  

Agents become significantly more accurate without recursion.

---

## 7. Integrity & Safety Rules

- Memory updates must be deterministic  
- Embeddings must reference stable IDs  
- No dynamic mutation of schemas  
- No circular semantic references  
- Memory may be regenerated from source manifests  
- No agent may update memory autonomously  
- Manual override must be possible  
- Context injection must be capped to prevent drift  

---

## 8. Performance Expectations

- 15–45 seconds to switch context across major projects  
- 4–7 hours weekly saved for high‑volume operators  
- Near‑zero time spent reloading project history  
- Sub‑second retrieval for cached clusters  
- Stable operation with <50k vectors  

---

## 9. When to Use Semantic Memory

You should enable this module when:

- Managing 8–15 active clients  
- Running multi‑industry modules  
- Frequently switching between Cockpit views  
- Running multiple blueprints weekly  
- Reviewing economics data across clients  
- Using agents for development or documentation  

---

## 10. When to Disable It

Disable the memory layer for:

- single‑project users  
- extremely small operations  
- environments with limited compute  
- early‑stage deployments (Phase 0–1)  

The system must remain optional and non‑blocking.