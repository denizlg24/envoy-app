import { prisma } from "@/lib/prisma";

export async function createProject(userId: string) {
  const project = await prisma.project.create({
    data: {
      members: {
        create: {
          userId,
          role: "owner",
        },
      },
    },
  });

  return project;
}

export async function addMember({
  projectId,
  userId,
  nickname,
}: {
  projectId: string;
  userId: string;
  nickname?: string;
}) {
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (existingMember) {
    return existingMember;
  }

  const projectMember = await prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role: "user",
      nickname,
    },
  });

  return projectMember;
}

export async function deleteMember({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const deleted = await prisma.projectMember.delete({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
  return deleted;
}

export async function listProjectMembers(projectId: string) {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
  });
  return members;
}

export async function deleteProjectMembers(projectId: string) {
  const deleted = await prisma.projectMember.deleteMany({
    where: { 
      projectId,
      role: { not: "owner" }
    },
  });
  return deleted.count;
}
