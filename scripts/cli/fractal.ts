#!/usr/bin/env node

/**
 * FractalOS CLI
 *
 * Provides a minimal deterministic command-line interface for:
 *  - inspecting Kernel metadata
 *  - listing projects, tasks, and patterns
 *  - triggering manual automations
 *
 * This CLI performs ZERO business logic.
 * Everything routes through Kernel APIs or manifest/pattern loaders.
 */

import { getManifest } from "../../kernel/manifests";
import { patternRegistry } from "../../kernel/patterns";
import { automationModule } from "../../modules/automation";
import { getProjects } from "../../api/projects";
import { getTasks } from "../../api/tasks";

const args = process.argv.slice(2);

async function main() {
  const command = args[0];

  switch (command) {
    case "manifest":
      console.log(JSON.stringify(getManifest(), null, 2));
      break;

    case "patterns":
      console.log(JSON.stringify(patternRegistry, null, 2));
      break;

    case "automation":
      console.log(JSON.stringify(automationModule, null, 2));
      break;

    case "projects":
      console.log(JSON.stringify(await getProjects(), null, 2));
      break;

    case "tasks":
      console.log(JSON.stringify(await getTasks(), null, 2));
      break;

    default:
      console.log(`
FractalOS CLI

Usage:
  fractal manifest         Show active manifest
  fractal patterns         List registered patterns
  fractal automation       List automation flows
  fractal projects         List all projects
  fractal tasks            List all tasks
`);
  }
}

main().catch((err) => {
  console.error("CLI Error:", err.message);
  process.exit(1);
});
