

/**
 * Kernel Command Registry
 *
 * This file aggregates and registers all command sets exposed by the Kernel.
 * Commands provide deterministic, typed operations used by:
 *  - Cockpit services
 *  - Economics Engine
 *  - Agents
 *
 * No business logic here — only safe, predictable exports.
 */

import { economicsCommands } from "./economics.commands";

export function registerCommands() {
  return {
    economics: economicsCommands
  };
}

export type KernelCommands = ReturnType<typeof registerCommands>;