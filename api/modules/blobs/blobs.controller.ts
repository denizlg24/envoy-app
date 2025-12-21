import type { Context } from "hono";
import { getUploadSignedUrl, getDownloadSignedUrl } from "./blobs.service";

export async function uploadBlob(c: Context) {
  const user = c.get("user");
  const { projectId, hash } = c.req.param();

  if (!projectId || !hash) {
    return c.json({ error: "Missing projectId or hash" }, 400);
  }

  const type = c.req.query("type") === "manifest" ? "manifest" : "blob";

  const result = await getUploadSignedUrl(
    user.id,
    projectId,
    hash,
    type
  );

  return c.json(result);
}

export async function downloadBlob(c: Context) {
  const user = c.get("user");
  const { projectId, hash } = c.req.param();

  if (!projectId || !hash) {
    return c.json({ error: "Missing projectId or hash" }, 400);
  }

  const type = c.req.query("type") === "manifest" ? "manifest" : "blob";

  const result = await getDownloadSignedUrl(
    user.id,
    projectId,
    hash,
    type
  );

  return c.json(result);
}