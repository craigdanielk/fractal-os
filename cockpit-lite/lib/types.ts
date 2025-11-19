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
  EconomicsModel,
  Vendor,
  DBClient,
  DBProject,
  DBTask,
  DBTimeEntry,
  DBEconomicsModel,
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
