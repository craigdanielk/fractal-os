/**
 * Kernel Internal Logic
 *
 * Contains pure helper functions used during boot and runtime.
 * These functions must remain:
 *  - deterministic
 *  - side‑effect free
 *  - UI‑agnostic
 *  - fully typed
 *
 * This file supports:
 *  - manifest validation
 *  - pattern resolution
 *  - schema introspection
 *  - environment checks
 */

import { KernelManifest } from "../manifests/base.manifest.json";
import { PatternDefinition } from "../patterns/index";
import * as Schemas from "../schemas";

/**
 * Validate that all required schemas exist before activation.
 */
export function validateSchemas(required: string[]): string[] {
  const available = Object.keys(Schemas);
  return required.filter((schema) => !available.includes(schema));
}

/**
 * Validate that all requested patterns exist.
 */
export function validatePatterns(
  patterns: string[],
  registry: Record<string, PatternDefinition>
): string[] {
  return patterns.filter((name) => !registry[name]);
}

/**
 * Validate manifest structure against Kernel expectations.
 */
export function validateManifest(manifest: KernelManifest): string[] {
  const errors: string[] = [];

  if (!manifest.name) errors.push("Manifest missing: name");
  if (!manifest.patterns || manifest.patterns.length === 0)
    errors.push("Manifest requires at least one pattern.");

  if (!manifest.modules) errors.push("Manifest missing: modules");

  return errors;
}

/**
 * Resolve pattern inheritance:
 *  - merges parent/child pattern definitions
 *  - ensures no circular inheritance
 */
export function resolveInheritance(
  patternName: string,
  registry: Record<string, PatternDefinition>,
  visited: Set<string> = new Set()
): PatternDefinition {
  if (visited.has(patternName)) {
    throw new Error(`Circular pattern inheritance detected at ${patternName}`);
  }

  const pattern = registry[patternName];
  if (!pattern) {
    throw new Error(`Pattern '${patternName}' not found.`);
  }

  if (!pattern.extends) return pattern;

  visited.add(patternName);

  const parent = resolveInheritance(pattern.extends, registry, visited);

  return {
    ...parent,
    ...pattern,
    scaffold: {
      ...parent.scaffold,
      ...pattern.scaffold
    },
    economics: {
      ...parent.economics,
      ...pattern.economics
    }
  };
}

/**
 * Assemble the resolved pattern set for a project manifest.
 */
export function resolvePatternsForManifest(
  manifest: KernelManifest,
  registry: Record<string, PatternDefinition>
): PatternDefinition[] {
  return manifest.patterns.map((p) => resolveInheritance(p, registry));
}
