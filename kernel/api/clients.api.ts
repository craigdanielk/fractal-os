import { db } from "../drizzle/client";

import { clients } from "../drizzle/schema";

import { eq, desc } from "drizzle-orm";



export const ClientAPI = {

  async list() {

    return db.select().from(clients).orderBy(desc(clients.createdAt));

  },



  async get(id: string) {

    return db.select().from(clients).where(eq(clients.id, id));

  },



  async create(data: any) {

    return db.insert(clients).values(data).returning();

  },



  async update(id: string, data: any) {

    return db.update(clients).set(data).where(eq(clients.id, id)).returning();

  }

};

