/**
 * FractalOS Kernel Boot Sequence
 *
 * The boot process is deterministic and is responsible for:
 *  - loading environment variables
 *  - registering schemas
 *  - loading and validating manifests
 *  - loading patterns
 *  - initialising the command registry
 *  - exposing a stable Kernel interface
 *
 * No business logic, no Cockpit dependencies, no recursion.
 */

import { loadEnv } from "../env/env.sample";
import * as Schemas from "../schemas";
import { loadManifest } from "../manifests/base.manifest.json";
import { loadPatterns } from "../patterns/index";
import { registerCommands } from "../commands/index";
import { KernelInterface } from "../utils/helpers";

export async function bootKernel(): Promise<KernelInterface> {
  // 1. Load environment configuration
  const env = loadEnv();
  if (!env) throw new Error("Failed to load environment configuration.");

  // 2. Register all schemas
  const schemaMap = { ...Schemas };
  if (Object.keys(schemaMap).length === 0) {
    throw new Error("Schema registration failed: no schemas found.");
  }

  // 3. Load and validate manifests
  const manifest = loadManifest();
  if (!manifest) throw new Error("Failed to load project manifest.");

  // 4. Load patterns
  const patterns = loadPatterns();
  if (!patterns) throw new Error("Pattern engine initialisation failed.");

  // 5. Initialise command registry
  const commands = registerCommands();

  // 6. Construct Kernel interface
  const kernel: KernelInterface = {
    env,
    schemas: schemaMap,
    manifest,
    patterns,
    commands
  };

  return kernel;
}
