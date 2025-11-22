FRACTALOS_MASTER_BUILD_ROADMAP_V1_0_0

SYSTEM_GOAL:
Produce a functional FractalOS BETA capable of running real client projects using a balanced Kernel/API architecture with MCP integration, agent logic, a cockpit workstation-lite UI, and deterministic build orchestration.

SYSTEM_STRUCTURE:
KERNEL_LAYER
API_LAYER
MCP_LAYER
AGENT_LAYER
COCKPIT_LAYER
WORKSPACE_LAYER
PROJECT_ENGINE
TASK_ENGINE
LOGGING_ENGINE
BUILD_ENGINE
ENV_LOADER
SCHEMA_LOADER
SYSTEM_LIFECYCLE

---------------------------------------------------------------------
1_SYSTEM_OVERVIEW
---------------------------------------------------------------------
OBJECTIVE:
Create an operational AI-driven automation environment that executes workflows, generates structured project/task objects, runs MCP tools, and exposes a cockpit UI for managing clients, projects, and tasks.

PRINCIPLES:
- deterministic execution
- unified data flow
- centralised state
- modular agents
- human->system clarity
- system->system interoperability
- reproducible builds

OPERATING_LAYERS:
- kernel orchestrates flows
- api exposes system functions
- mcp executes external/AI logic
- agents generate structured outputs
- cockpit provides human interface
- workspace stores local state
- build engine compiles entire system

TECH_STACK:
node_js
typescript
supabase
fly_io
mcp
cursor_codex
next_js
tailwind
local_json_storage

RUNTIME_TOPOLOGY:
kernel <-> api <-> mcp <-> agents <-> cockpit <-> workspace

---------------------------------------------------------------------
2_CORE_ARCHITECTURAL_LAYERS
---------------------------------------------------------------------

2_1_KERNEL_LAYER:
RESPONSIBILITY:
- state orchestration
- workflow routing
- execution sequence ordering
- error propagation
- queue processing

INPUTS:
- api requests
- agent requests
- cockpit commands
- mcp tool results

OUTPUTS:
- tasks
- projects
- logs
- job queues

DEPENDENCIES:
- api
- task_engine
- project_engine
- logging_engine

2_2_API_LAYER:
RESPONSIBILITY:
- system I/O endpoints
- data creation/update
- structured response envelopes
- schema validation

INPUTS:
- http requests
- kernel calls

OUTPUTS:
- project objects
- task objects
- system metadata
- logs

DEPENDENCIES:
- schema_loader
- env_loader

2_3_MCP_LAYER:
RESPONSIBILITY:
- tool execution
- ai-assisted transformations
- long-running operations
- health reporting

INPUTS:
- kernel triggers
- agent requests

OUTPUTS:
- generated content
- processed data
- execution logs

DEPENDENCIES:
- tool registry

2_4_AGENT_LAYER:
RESPONSIBILITY:
- project expansion
- task generation
- structured data transformation

INPUTS:
- project objects
- user command input
- kernel triggers

OUTPUTS:
- expanded projects
- auto-generated tasks

DEPENDENCIES:
- task engine
- project engine

2_5_COCKPIT_LAYER:
RESPONSIBILITY:
- human UI
- project/task visualization
- workflow initiation

INPUTS:
- api data
- kernel state

OUTPUTS:
- user commands
- project/task edits

2_6_WORKSPACE_LAYER:
RESPONSIBILITY:
- local JSON persistence
- offline mode
- cockpit state storage

INPUTS:
- cockpit interactions

OUTPUTS:
- session data
- preferences
- local cache

2_7_DATA_LAYER:
RESPONSIBILITY:
- project model
- task model
- system model
- schema enforcement

---------------------------------------------------------------------
3_MODULE_DEFINITIONS
---------------------------------------------------------------------

MODULE_PROJECT_ENGINE:
PURPOSE: project CRUD + structuring
INPUT: project data, schema
OUTPUT: structured project object
FAILURES: schema violation

MODULE_TASK_ENGINE:
PURPOSE: task CRUD + agent generation
INPUT: project object, generator params
OUTPUT: tasks
FAILURES: missing project ref

MODULE_LOGGING_ENGINE:
PURPOSE: centralised structured logs
INPUT: kernel, agents, mcp, api
OUTPUT: log files

MODULE_BUILD_ENGINE:
PURPOSE: wave/phase compilation
INPUT: roadmap.md
OUTPUT: build instructions

MODULE_ENV_LOADER:
PURPOSE: unified .env parsing
OUTPUT: global env object

MODULE_SCHEMA_LOADER:
PURPOSE: load system schemas
OUTPUT: unified schema object

MODULE_SYSTEM_LIFECYCLE:
PURPOSE: bootstrap + shutdown logic

---------------------------------------------------------------------
4_BUILD_PIPELINE
---------------------------------------------------------------------
SEQUENCE:
1: validate_environment
2: load_schemas
3: register_mcp_tools
4: init_api
5: init_kernel
6: init_agents
7: init_workspace
8: init_cockpit_lite
9: launch_mcp_loop
10: verify_system_health
11: ready

---------------------------------------------------------------------
5_WAVE_PHASE_MAPPING
---------------------------------------------------------------------
WAVES: 10 (ALPHA → KAPPA)
PHASES_PER_WAVE: 7
MAX_TOKENS_PER_PHASE: 14000
ORDER: alphabetical waves → numerical phases
CONTINUITY: spill-over to next phase when full
NO_EMPTY_PHASES
NO_PLACEHOLDERS

---------------------------------------------------------------------
6_MASTER_PROMPT_SPECIFICATION
---------------------------------------------------------------------
CONTENT_SEGMENTS:
- kernel_spec
- api_spec
- mcp_spec
- agent_spec
- cockpit_spec
- workspace_spec
- project_engine_spec
- task_engine_spec
- logging_engine_spec
- build_engine_spec
- env_loader_spec
- schema_loader_spec
- lifecycle_spec
- integration_rules
- activation_sequence

FORMAT:
token_dense_instruction_blocks

---------------------------------------------------------------------
7_EXECUTION_RULES
---------------------------------------------------------------------
- phases concatenated in order
- kernel validates sequence integrity
- errors halt build
- logs written synchronously
- successful build writes SYSTEM_READY=true

---------------------------------------------------------------------
8_REVISION_PROTOCOL
---------------------------------------------------------------------
SPEC_REVISION:
trigger: "REVISE SPEC"
action: bump_version
require: full regeneration of waves/phases

END_OF_ROADMAP