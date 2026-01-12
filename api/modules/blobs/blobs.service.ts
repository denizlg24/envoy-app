import { prisma } from "@/lib/prisma";
import {
  manifestKey,
  blobKey,
  getUploadUrl,
  getDownloadUrl,
  commitKey,
} from "@/lib/storage";

export async function getUploadSignedUrl(
  userId: string,
  projectId: string,
  hash: string,
  type: "blob" | "manifest" | "commit"
) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!membership) {
    throw new Error("Not authorized");
  }

  const owner = await prisma.projectMember.findFirst({
    where: { projectId, role: "owner" },
    select: { userId: true },
  });

  if (!owner) {
    throw new Error("Project owner not found");
  }

  const key =
    type === "manifest"
      ? manifestKey(owner.userId, projectId, hash)
      : type === "commit"
      ? commitKey(owner.userId, projectId, hash)
      : blobKey(owner.userId, projectId, hash);

  return getUploadUrl(key);
}

export async function getDownloadSignedUrl(
  userId: string,
  projectId: string,
  hash: string,
  type: "blob" | "manifest" | "commit"
) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!membership) {
    throw new Error("Not authorized");
  }

  const owner = await prisma.projectMember.findFirst({
    where: { projectId, role: "owner" },
    select: { userId: true },
  });

  if (!owner) {
    throw new Error("Project owner not found");
  }

  const key =
    type === "manifest"
      ? manifestKey(owner.userId, projectId, hash)
      : type === "commit"
      ? commitKey(owner.userId, projectId, hash)
      : blobKey(owner.userId, projectId, hash);

  return getDownloadUrl(key);
}
