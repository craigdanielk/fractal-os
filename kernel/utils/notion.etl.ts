import { Client } from "@notionhq/client";

import { db } from "../drizzle/client";

import { clients, projects, tasks, timeEntries, economics } from "../drizzle/schema";



const notion = new Client({ auth: process.env.NOTION_INTEGRATION_SECRET });



export async function migrateNotionToSupabase(notDb: any) {

  const { type } = notDb;



  if (type === "clients") {

    for (const row of notDb.rows) {

      await db.insert(clients).values({

        name: row.Name,

        type: row.Type,

        status: row.Status,

        region: row.Region,

        contactPerson: row.Contact,

        contactEmail: row.Email,

        contactNumber: row.Phone,

        website: row.Website,

        defaultRate: row.Rate

      });

    }

  }



  if (type === "projects") {

    for (const row of notDb.rows) {

      await db.insert(projects).values({

        name: row.Name,

        description: row.Description,

        projectType: row.ProjectType,

        priority: row.Priority,

        healthScore: row.HealthScore,

        startDate: row.StartDate,

        targetEndDate: row.TargetEnd,

        actualEndDate: row.EndDate,

        budget: row.Budget,

        actualCost: row.ActualCost,

        notes: row.Notes,

        systemReference: row.SystemReference,

        progress: row.Progress,

        clientId: row.ClientId

      });

    }

  }



  if (type === "tasks") {

    for (const row of notDb.rows) {

      await db.insert(tasks).values({

        name: row.Name,

        description: row.Description,

        status: row.Status,

        dueDate: row.DueDate,

        priority: row.Priority,

        assignee: row.Assignee,

        estimateHours: row.EstHours,

        projectId: row.ProjectId,

        parentTaskId: row.ParentId

      });

    }

  }



  if (type === "time") {

    for (const row of notDb.rows) {

      await db.insert(timeEntries).values({

        sessionName: row.SessionName,

        sessionDate: row.SessionDate,

        startTime: row.StartTime,

        endTime: row.EndTime,

        durationHours: row.Duration,

        userEmail: row.User,

        taskId: row.TaskId,

        notes: row.Notes

      });

    }

  }



  if (type === "economics") {

    for (const row of notDb.rows) {

      await db.insert(economics).values({

        name: row.Name,

        baseRate: row.BaseRate,

        directExpenses: row.DirectExpenses,

        marginTarget: row.MarginTargets,

        overheadPercent: row.Overhead

      });

    }

  }

}

