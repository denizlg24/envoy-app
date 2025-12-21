import type { Context } from "hono";
import { createProject as serviceCreateProject } from "./projects.service";
export async function createProject(c: Context) {
  const user = c.get("user");
  const project = await serviceCreateProject(user.id);
  return c.json({ projectId: project.id });
}