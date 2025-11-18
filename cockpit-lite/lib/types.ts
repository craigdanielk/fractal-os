/**
 * Type Definitions
 * 
 * Centralized type exports matching FractalOS Kernel schemas
 */

export interface Task {
  id: string;
  name: string;
  projectId: string;
  description?: string;
  status: "open" | "in_progress" | "blocked" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  description?: string;
  revenue?: number;
  status: "active" | "paused" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  userId?: string;
  hours: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EconomicsModel {
  id: string;
  name: string;
  hourlyRates?: Record<string, number>;
  overheadCost?: number;
  directExpenses?: number;
  marginTargets?: {
    min: number;
    ideal: number;
  };
  modelType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EconomicsOverview {
  revenue: number;
  labourCost: number;
  overheadCost: number;
  directExpenses: number;
  totalCost: number;
  contribution: number;
  margin: number;
}

