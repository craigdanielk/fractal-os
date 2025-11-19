/****
 * Cockpit UI Index
 *
 * Centralised export boundary for all UI-layer utilities.
 * This file ensures deterministic import paths across the Cockpit.
 *
 * Rules:
 *  - Only re-export stable UI utilities (theme, primitives, tokens).
 *  - Component-level exports live under /cockpit/components.
 */

export * from "./theme";
