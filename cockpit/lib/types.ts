/**
 * Type Definitions
 * 
 * Re-export Supabase types for backward compatibility
 * New code should import directly from supabase-types.ts
 */

export type {
  Client,
  Project,
  Task,
  TimeEntry,
  Economics,
  EconomicsModel, // Legacy alias
  Vendor,
  DBClient,
  DBProject,
  DBTask,
  DBTimeEntry,
  DBEconomics,
  DBEconomicsModel, // Legacy alias
  DBVendor,
} from "./supabase-types";

export interface EconomicsOverview {
  revenue: number;
  labourCost: number;
  overheadCost: number;
  directExpenses: number;
  totalCost: number;
  contribution: number;
  margin: number;
}
