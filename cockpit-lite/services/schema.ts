import type {
  DBClient,
  DBProject,
  DBTask,
  DBTimeEntry,
  DBEconomicsModel,
  DBVendor,
} from "@/lib/supabase-types";

export type ClientRow = DBClient;
export type ProjectRow = DBProject;
export type TaskRow = DBTask;
export type TimeEntryRow = DBTimeEntry;
export type EconomicsRow = DBEconomicsModel;
export type VendorRow = DBVendor;

