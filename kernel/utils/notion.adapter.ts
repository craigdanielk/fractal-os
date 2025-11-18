/**
 * Notion Adapter (Lite Cockpit Bridge)
 *
 * Maps Notion database items into FractalOS Kernel schema objects.
 * Temporary bridge until full Supabase integration.
 */

export interface NotionTaskPayload { id: string; properties: Record<string, any>; }
export interface NotionProjectPayload { id: string; properties: Record<string, any>; }
export interface NotionTimePayload { id: string; properties: Record<string, any>; }

export function mapNotionTaskToFractal(task: NotionTaskPayload) {
  return {
    id: task.id,
    name: task.properties.Name?.title?.[0]?.plain_text || "Untitled Task",
    projectId: task.properties.Project?.relation?.[0]?.id || "",
    description: task.properties.Description?.rich_text?.[0]?.plain_text || "",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function mapNotionProjectToFractal(project: NotionProjectPayload) {
  return {
    id: project.id,
    name: project.properties.Name?.title?.[0]?.plain_text || "Untitled Project",
    clientId: project.properties.Client?.relation?.[0]?.id || "",
    description: project.properties.Description?.rich_text?.[0]?.plain_text || "",
    revenue: 0,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function mapNotionTimeToFractal(time: NotionTimePayload) {
  return {
    id: time.id,
    taskId: time.properties.Task?.relation?.[0]?.id || "",
    projectId: time.properties.Project?.relation?.[0]?.id || "",
    hours: parseFloat(time.properties.Hours?.number || 0),
    notes: time.properties.Notes?.rich_text?.[0]?.plain_text || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

