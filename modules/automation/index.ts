/**
 * Automation Module Index
 *
 * Provides typed access to automation flows registered in
 * this module. Automations in FractalOS are always:
 *  - deterministic
 *  - human-triggered
 *  - pattern-based
 *  - non-autonomous
 */

import flows from "./flows.json";

export const automationModule = {
  version: "1.0.0",
  flows
};
