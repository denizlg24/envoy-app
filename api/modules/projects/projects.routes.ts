import { Hono } from "hono";
import { createProject } from "./projects.controller";
import { authMiddleware } from "@/api/middleware/auth.middleware";

export const projectRoutes = new Hono();

projectRoutes.use("*", authMiddleware);
projectRoutes.post("/", createProject);