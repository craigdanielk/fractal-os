

/**
 * Client Schema
 *
 * Defines the structure of a client within FractalOS.
 * This schema is used by:
 *  - Kernel (validation, manifests)
 *  - Economics Engine (client contribution)
 *  - Cockpit (client views)
 *  - Agents (typed operations)
 */

export interface Client {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export const clientSchema = {
  table: "clients",
  primaryKey: "id",
  fields: {
    id: "string",
    name: "string",
    description: "string?",
    industry: "string?",
    createdAt: "string",
    updatedAt: "string"
  }
};

export function createClient(data: Partial<Client>): Client {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || "Unnamed Client",
    description: data.description || "",
    industry: data.industry || "",
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}