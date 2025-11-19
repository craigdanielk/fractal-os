import { createProject, updateProject } from "../projects";
import type { DBProject } from "../../lib/supabase-types";

export async function createProjectAction(input: Partial<DBProject>) {
  return createProject(input);
}

export async function updateProjectAction(id: string, input: Partial<DBProject>) {
  return updateProject(id, input);
}
