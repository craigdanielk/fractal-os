

/**
 * Pattern Registry
 *
 * Loads and exposes all pattern definitions to the Kernel.
 * Supports:
 *  - pattern validation
 *  - inheritance resolution
 *  - manifest-driven activation
 */

import basePattern from "./base.pattern.json";

export const patternRegistry = {
  "base-pattern": basePattern
};

export type PatternDefinition = typeof basePattern;

/**
 * Load all patterns into a single registry object.
 * Called by the Kernel boot process.
 */
export function loadPatterns() {
  return patternRegistry;
}