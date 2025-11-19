/**
 * Type Definitions
 * 
 * Centralized type exports matching FractalOS Kernel schemas
 */

export interface Task {
  id: string;
  title: string;
  raw: any;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  health: string;
  client: string | null;
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
  title: string;
  raw: any;
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

