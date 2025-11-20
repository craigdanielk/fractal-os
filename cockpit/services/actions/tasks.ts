import { createTask, updateTask } from "../tasks";
import type { DBTask } from "../../lib/supabase-types";

export async function createTaskAction(input: Partial<DBTask>) {
  return createTask(input);
}

export async function updateTaskAction(id: string, input: Partial<DBTask>) {
  return updateTask(id, input);
}
