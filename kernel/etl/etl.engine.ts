import { db } from "../drizzle/client";

import { projects, clients, tasks, timeEntries, economics } from "../drizzle/schema";



export async function ETL_LoadAll() {

  const [p, c, t, te, e] = await Promise.all([

    db.select().from(projects),

    db.select().from(clients),

    db.select().from(tasks),

    db.select().from(timeEntries),

    db.select().from(economics),

  ]);



  return { projects: p, clients: c, tasks: t, time: te, economics: e };

}



export async function ETL_LoadProjects() {

  return db.select().from(projects);

}



export async function ETL_LoadClients() {

  return db.select().from(clients);

}



export async function ETL_LoadTasks() {

  return db.select().from(tasks);

}



export async function ETL_LoadTime() {

  return db.select().from(timeEntries);

}



export async function ETL_LoadEconomics() {

  return db.select().from(economics);

}

