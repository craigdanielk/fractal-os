# FractalOS Agents Layer Architecture

The Agents Layer provides deterministic, tool-driven assistance for blueprint generation, documentation, automation, schema work, and repetitive operational tasks. It is *not* an autonomous AI system and contains no recursion. It executes predictable actions based on explicit inputs.

---

## 1. Purpose of the Agents Layer

The Agents Layer exists to:

- accelerate system-building tasks  
- reduce repetitive development work  
- generate blueprints and scaffolds  
- assist with documentation  
- provide safe MCP command execution  
- support multi-project work without context loss  
- help operators standardise client setups  

Agents are assistants — not decision-makers.

---

## 2. Design Principles

- **Deterministic**: No free-form decision-making.  
- **Tool-based**: Agents can only use approved tools.  
- **Non-recursive**: No chain-calling of agents.  
- **Context-limited**: Agents receive only relevant memory slices.  
- **Pattern-aware**: Agents can read pattern definitions.  
- **Manifest-respecting**: Agents cannot modify manifests without user consent.  
- **Safety-first**: No schema mutations unless explicitly triggered.  

This ensures predictable, production-safe behaviour.

---

## 3. Agent Types

FractalOS defines multiple agent classes:

### 3.1 Builder Agents
Support blueprint generation:

- scaffold repos  
- apply patterns  
- inject manifests  
- generate boilerplate code  
- validate directory integrity  

### 3.2 Documentation Agents
Assist with:

- generating module docs  
- writing architecture files  
- updating manifests  
- creating SOPs  
- explaining patterns and economics models  

### 3.3 Automation Agents
Handle:

- predictable n8n or Supabase workflow generation  
- safe script generation  
- maintenance script creation  

### 3.4 Analysis Agents
Support:

- economics analysis  
- contribution insight generation  
- cross-project comparisons  
- semantic memory retrieval  

Each agent class is limited to predefined commands.

---

## 4. Tool Registry

Located in:

```
agents/registry/commands.json
```

Defines allowed operations, e.g.:

```
{
  "scaffold": ["createDir", "createFile"],
  "docs": ["writeMarkdown", "summarise"],
  "automation": ["generateScript", "modifyJson"],
  "analysis": ["embed", "searchSimilar"]
}
```

Tools must be:

- idempotent  
- predictable  
- fully logged  
- Kernel-safe  

---

## 5. Workflows

Workflows live in:

```
agents/workflows/
```

Each workflow is a deterministic step-by-step definition.

Example (simplified):

```
[
  { "step": "loadPattern", "pattern": "web-base" },
  { "step": "generateScaffold", "target": "new-project" },
  { "step": "injectManifest", "source": "pattern.manifest" }
]
```

Workflows never call other workflows.

---

## 6. MCP Integration

Agents optionally use MCP commands when available.

They may:

- execute predefined commands  
- read directory trees  
- write files  
- update documentation  

But they may *not*:

- execute arbitrary code  
- refactor schemas  
- perform multi-step self-calls  
- use recursive message loops  

MCP usage is always gated by the Kernel.

---

## 7. Semantic Memory Integration

Agents receive:

- nearby semantic neighbours  
- distilled summaries  
- relevant manifest context  
- project memory snapshots  

This dramatically improves agent accuracy while remaining deterministic.

---

## 8. Security Rules

To prevent agent drift:

- No agent may mutate schema files  
- No agent may alter manifests without explicit user confirmation  
- No agent may modify economics models  
- All writes are logged  
- All MCP calls must declare tool usage  
- No agent may spawn another agent  

These rules protect the long-term stability of FractalOS.

---

## 9. Future Extensions

Future versions of the Agents Layer may add:

- multi-agent concurrency (still deterministic)  
- richer economics analysis commands  
- module-specific agent classes  
- internal testing and linting agents  

These extensions remain optional and controlled.

---

## 10. Layer Integrity Summary

The Agents Layer:

- increases productivity  
- remains safe by design  
- respects Kernel boundaries  
- accelerates blueprint and documentation creation  
- benefits from semantic memory  
- never undermines system determinism  

It is an enhancement layer — not a control system.
