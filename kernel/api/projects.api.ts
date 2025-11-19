import { db } from "../drizzle/client";

import { projects } from "../drizzle/schema";

import { eq, desc } from "drizzle-orm";



export const ProjectAPI = {

  async list() {

    return db.select().from(projects).orderBy(desc(projects.createdAt));

  },



  async get(id: string) {

    return db.select().from(projects).where(eq(projects.id, id));

  },



  async create(data: any) {

    return db.insert(projects).values(data).returning();

  },



  async update(id: string, data: any) {

    return db.update(projects).set(data).where(eq(projects.id, id)).returning();

  }

};

