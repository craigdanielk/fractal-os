/ **
 * Project Schema
 *
 * Defines the structure of a project in FractalOS.
 * Used by:
 *  - Kernel manifests
 *  - Economics engine
 *  - Cockpit dashboards
 *  - Agents performing typed operations
 * /

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

export const projectSchema = {
  table: "projects",
  primaryKey: "id",
  fields: {
    id: "string",
    name: "string",
    clientId: "string",
    description: "string?",
    revenue: "number?",
    status: "string",
    createdAt: "string",
    updatedAt: "string"
  }
};

export function createProject(data: Partial<Project>): Project {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || "Untitled Project",
    clientId: data.clientId || "",
    description: data.description || "",
    revenue: data.revenue ?? 0,
    status: data.status || "active",
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}
