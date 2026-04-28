import { prisma } from "@/lib/prisma";
import {
  manifestKey,
  blobKey,
  getUploadUrl,
  getDownloadUrl,
  commitKey,
  objectExists,
} from "@/lib/storage";

function storageKey(
  type: "blob" | "manifest" | "commit",
  userId: string,
  projectId: string,
  hash: string
) {
  return type === "manifest"
    ? manifestKey(userId, projectId, hash)
    : type === "commit"
    ? commitKey(userId, projectId, hash)
    : blobKey(userId, projectId, hash);
}

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

  const key = storageKey(type, owner.userId, projectId, hash);

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

  const ownerKey = storageKey(type, owner.userId, projectId, hash);
  const requesterKey = storageKey(type, userId, projectId, hash);
  const key =
    (await objectExists(ownerKey)) || owner.userId === userId
      ? ownerKey
      : (await objectExists(requesterKey))
      ? requesterKey
      : ownerKey;

  return getDownloadUrl(key);
}
