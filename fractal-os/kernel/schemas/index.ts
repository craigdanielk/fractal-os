/****
 * Kernel Schema Index
 *
 * Central export hub for all entity schemas used across:
 *  - Kernel logic
 *  - Drizzle ORM
 *  - Cockpit services
 *  - Agents & Commands
 *  - API routes
 */

export * from "./client.schema";
export * from "./project.schema";
export * from "./task.schema";
export * from "./time_entry.schema";
export * from "./economics.schema";