

/**
 * Economics Schema
 *
 * Defines the structure of cost models, revenue models,
 * and contribution fields used by the Economics Engine.
 *
 * This schema is referenced by:
 *  - economics.commands.ts
 *  - Cockpit economics page
 *  - manifest economics configuration
 *  - pattern-level economics defaults
 */

export interface EconomicsModel {
  id: string;
  name: string;

  // Base hourly rates by role
  hourlyRates?: Record<string, number>;

  // Economics model metadata
  overheadCost?: number;
  directExpenses?: number;

  // Margin targets
  marginTargets?: {
    min: number;
    ideal: number;
  };

  // Model type (agency, manufacturing, logistics, etc.)
  modelType: string;

  createdAt: string;
  updatedAt: string;
}

export const economicsSchema = {
  table: "economics_models",
  primaryKey: "id",
  fields: {
    id: "string",
    name: "string",
    hourlyRates: "json?",
    overheadCost: "number?",
    directExpenses: "number?",
    marginTargets: "json?",
    modelType: "string",
    createdAt: "string",
    updatedAt: "string"
  }
};

export function createEconomicsModel(data: Partial<EconomicsModel>): EconomicsModel {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || "Default Economics Model",
    hourlyRates: data.hourlyRates || {},
    overheadCost: data.overheadCost ?? 0,
    directExpenses: data.directExpenses ?? 0,
    marginTargets: data.marginTargets || { min: 0.1, ideal: 0.3 },
    modelType: data.modelType || "agency",
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}