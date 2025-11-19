import { db } from "../drizzle/client";

import { timeEntries } from "../drizzle/schema";

import { eq, desc } from "drizzle-orm";



export const TimeAPI = {

  async list() {

    return db.select().from(timeEntries).orderBy(desc(timeEntries.sessionDate));

  },



  async get(id: string) {

    return db.select().from(timeEntries).where(eq(timeEntries.id, id));

  },



  async create(data: any) {

    return db.insert(timeEntries).values(data).returning();

  },



  async update(id: string, data: any) {

    return db.update(timeEntries).set(data).where(eq(timeEntries.id, id)).returning();

  }

};

