// Fractal Mapper v1 – Normalises all Notion entities for Cockpit Lite

import type {
  NotionTask,
  NotionProject,
  NotionClient,
  NotionVendor,
  NotionSession,
} from "./notion-types";

export function mapClient(c: NotionClient) {
  return {
    id: c.id,
    name: c.title,
    status: c.status,
    email: c.contact_email,
    notes: c.notes,
    priority: c.priority ?? null,
    billingCurrency: c.billing_currency ?? null,
    projectIds: c.projects ?? [],
    totals: {
      activeProjects: c.total_active_projects ?? 0,
      billable: c.total_billable ?? 0,
      hours: c.total_hours ?? 0,
      variantCost: c.total_active_variant_cost ?? 0,
    },
    systemReference: c.system_reference ?? "fractal",
    created: c.created_time,
  };
}

export function mapProject(p: NotionProject) {
  return {
    id: p.id,
    name: p.title,
    status: p.status,
    priority: p.priority,
    start: p.start_date,
    due: p.due_date,
    clientId: p.client_id ?? null,
    description: p.description,
    urls: {
      contract: p.contract_url ?? null,
      store: p.shopify_store_url ?? null,
    },
    hours: {
      est: p.budgeted_hours ?? 0,
      logged: p.logged_hours ?? 0,
      totalEst: p.total_estimated_hours ?? 0,
      totalLogged: p.total_logged_hours ?? 0,
      progressPct:
        p.budgeted_hours && p.logged_hours
          ? Math.min(100, Math.round((p.logged_hours / p.budgeted_hours) * 100))
          : 0,
    },
    variant: {
      selected: p.selected_variant ?? "A",
      activeCost: p.active_variant_cost ?? 0,
      hrRate: p.hourly_rate_dynamic ?? null,
    },
    taskIds: p.task_ids ?? [],
    systemReference: p.system_reference,
    created: p.created_time,
  };
}

export function mapTask(t: NotionTask) {
  return {
    id: t.id,
    name: t.title,
    status: t.status,
    priority: t.priority,
    assignee: t.assigned_to ?? null,
    dates: {
      start: t.start_date,
      due: t.due_date,
    },
    hours: {
      est: t.estimated_hours ?? 0,
      logged: t.logged_hours ?? 0,
      cum: t.cumulative_logged_hours ?? 0,
      remaining:
        t.estimated_hours && t.logged_hours
          ? t.estimated_hours - t.logged_hours
          : t.estimated_hours ?? 0,
      progressPct:
        t.estimated_hours && t.logged_hours
          ? Math.min(100, Math.round((t.logged_hours / t.estimated_hours) * 100))
          : 0,
    },
    hierarchy: {
      parentId: t.parent_task_id ?? null,
      subtaskIds: t.subtask_ids ?? [],
    },
    flags: {
      blocked: !!t.blocked,
      overdue: !!t.overdue,
      topLevel: t.top_level ?? 0,
    },
    related: {
      projectId: t.project_id ?? null,
      vendorIds: t.vendor_ids ?? [],
      sessionIds: t.session_ids ?? [],
    },
    tags: t.tags ?? [],
    systemReference: t.system_reference,
    created: t.created_time,
  };
}

export function mapVendor(v: NotionVendor) {
  return {
    id: v.id,
    name: v.title,
    email: v.contact_email ?? null,
    phone: v.phone_number ?? null,
    services: v.services ?? "",
    linkedTaskIds: v.linked_tasks ?? [],
    created: v.created_time,
  };
}

export function mapSession(s: NotionSession) {
  return {
    id: s.id,
    name: s.title,
    start: s.session_start,
    end: s.session_end,
    duration: s.duration_hours ?? 0,
    taskId: s.task_id ?? null,
    projectId: s.project_id ?? null,
    clientId: s.client_id ?? null,
    notes: s.notes ?? "",
    created: s.created_time,
  };
}

