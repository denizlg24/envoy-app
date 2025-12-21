import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware";
import { downloadBlob, uploadBlob } from "./blobs.controller";
export const blobRoutes = new Hono();

blobRoutes.use("*", authMiddleware);

blobRoutes.post(
  "/projects/:projectId/blobs/:hash/upload",
  uploadBlob
);

blobRoutes.get(
  "/projects/:projectId/blobs/:hash/download",
  downloadBlob
);