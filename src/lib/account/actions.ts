"use server";

import { auth } from "@/auth";
import type { userSchemaType } from "@/lib/group/verification";
import { prisma } from "@/prisma";

export async function getUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const res = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    return res;
  }
}

export async function update(prop: userSchemaType) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!contest) {
      throw new Error("User ID does not exist.");
    } else {
      const res = await prisma.user.update({
        where: {
          id: session?.user?.id,
        },
        data: {
          displayName: prop.displayName,
        },
      });

      return res;
    }
  }
}
