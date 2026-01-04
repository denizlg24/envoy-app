import { Hono } from "hono";
import { addMember, createProject, listMembers, removeMember, removeAllMembers } from "./projects.controller";
import { authMiddleware } from "@/api/middleware/auth.middleware";

export const projectRoutes = new Hono();

projectRoutes.use("*", authMiddleware);
projectRoutes.post("/", createProject);
projectRoutes.get("/:projectId/members", listMembers);
projectRoutes.post("/:projectId/members", addMember);
projectRoutes.delete("/:projectId/members/:userId", removeMember);
projectRoutes.delete("/:projectId/members", removeAllMembers);