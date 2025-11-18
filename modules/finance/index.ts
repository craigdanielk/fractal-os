

/**
 * Finance Module Index
 *
 * Provides access to financial models and helpers used by
 * the Economics Engine and Cockpit economics dashboard.
 *
 * This module does NOT perform any business logic.
 * All financial computation stays inside Kernel economics commands.
 */

import models from "./models.json";

export const financeModule = {
  version: "1.0.0",
  models
};