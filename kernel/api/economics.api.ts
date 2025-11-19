import { db } from "../drizzle/client";

import { economics } from "../drizzle/schema";

import { eq, desc } from "drizzle-orm";



export const EconomicsAPI = {

  async list() {

    return db.select().from(economics).orderBy(desc(economics.createdAt));

  },



  async get(id: string) {

    return db.select().from(economics).where(eq(economics.id, id));

  },



  async create(data: any) {

    return db.insert(economics).values(data).returning();

  },



  async update(id: string, data: any) {

    return db.update(economics).set(data).where(eq(economics.id, id)).returning();

  }

};

