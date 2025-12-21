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