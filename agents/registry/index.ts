/******************************************
 * Agent Command Registry Loader
 *
 * Loads the JSON command registry and exposes
 * a typed interface for agent execution.
 ******************************************/

import commands from "./commands.json";

export type CommandRegistry = typeof commands;

/**
 * Returns the full static registry.
 * Agents never dynamically generate commands.
 */
export function getCommandRegistry(): CommandRegistry {
  return commands;
}

/**
 * Resolve a command path such as "tasks.create"
 * into the fully qualified kernel command string.
 *
 * Example:
 *   resolveCommand("tasks.create")
 *   → "kernel.tasks.create"
 */
export function resolveCommand(path: string): string {
  const parts = path.split(".");

  if (parts.length !== 2) {
    throw new Error(`Invalid command path: ${path}`);
  }

  const [group, key] = parts;

  // @ts-expect-error - safe lookup enforced by JSON typing
  const cmd = commands[group]?.[key];

  if (!cmd) {
    throw new Error(`Command not found: ${path}`);
  }

  return cmd;
}
