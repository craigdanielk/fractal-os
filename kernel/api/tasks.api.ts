import { db } from "../drizzle/client";

import { tasks } from "../drizzle/schema";

import { eq, desc } from "drizzle-orm";



export const TaskAPI = {

  async list() {

    return db.select().from(tasks).orderBy(desc(tasks.createdAt));

  },



  async get(id: string) {

    return db.select().from(tasks).where(eq(tasks.id, id));

  },



  async create(data: any) {

    return db.insert(tasks).values(data).returning();

  },



  async update(id: string, data: any) {

    return db.update(tasks).set(data).where(eq(tasks.id, id)).returning();

  }

};

