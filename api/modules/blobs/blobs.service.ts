import { prisma } from "@/lib/prisma";
import { manifestKey, blobKey, getUploadUrl, getDownloadUrl } from "@/lib/storage";


export async function getUploadSignedUrl(
  userId: string,
  projectId: string,
  hash: string,
  type: "blob" | "manifest"
) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!membership) {
    throw new Error("Not authorized");
  }

  const key =
    type === "manifest"
      ? manifestKey(userId, projectId, hash)
      : blobKey(userId, projectId, hash);

  return getUploadUrl(key);
}

export async function getDownloadSignedUrl(
  userId: string,
  projectId: string,
  hash: string,
  type: "blob" | "manifest"
) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!membership) {
    throw new Error("Not authorized");
  }

  const key =
    type === "manifest"
      ? manifestKey(userId, projectId, hash)
      : blobKey(userId, projectId, hash);

  return getDownloadUrl(key);
}