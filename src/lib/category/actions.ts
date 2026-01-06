"use server";
import { cache } from "react";

import { auth } from "@/auth";
import type {
  categoryCreateSchemaType,
  categoryExcludeSchemaType,
  categoryGetByIdSchemaType,
  categoryUpdateSchemaType,
} from "@/lib/category/verification";
import { prisma } from "@/prisma";

export async function getById(prop: categoryGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.category.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, updatedUser: true },
  });
  return res;
}

export async function reOrder() {
  await prisma.$transaction(async (prisma) => {
    const list = await prisma.category.findMany({
      where: {
        order: { gt: 0 },
      },
      orderBy: [
        {
          order: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    if (!list) throw Error("There is no category data.");

    for (let i = 0; i < list.length; i++) {
      await prisma.category.update({
        where: {
          id: list[i].id,
        },
        data: {
          order: i + 1,
        },
      });
    }
  });
}

export async function create(prop: categoryCreateSchemaType) {
  const { name, link, order, role } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const res = await prisma.category.create({
      include: { createdUser: true, updatedUser: true },
      data: {
        name: name,
        link: link,
        order: order,
        role: role,
        createdUserId: session?.user?.id,
        updatedUserId: null,
      },
    });
    return res;
  }
}

export async function update(prop: categoryUpdateSchemaType) {
  const { id, name, link, order, role } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.category.findFirst({
      where: { id: id },
      include: {
        createdUser: true,
        updatedUser: true,
      },
    });

    if (!contest) {
      throw new Error("Category ID does not exist.");
    } else {
      const res = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          name: name,
          link: link,
          order: order,
          role: role,
          updatedUserId: session?.user?.id,
        },
      });

      const response = {
        createdUser: contest.createdUser,
        updatedUser: contest.updatedUser ?? null,
        ...res,
      };
      return response;
    }
  }
}
export const getList = cache(async () => {
  const res = await prisma.category.findMany({
    include: { createdUser: true, updatedUser: true },
    orderBy: [
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
  return res;
});

export async function exclude(prop: categoryExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.category.findFirst({
      where: { id: id },
      include: {
        createdUser: true,
        updatedUser: true,
      },
    });

    if (!contest) {
      throw new Error("Category ID does not exist.");
    } else {
      await prisma.category.delete({
        where: {
          id: id,
        },
      });
    }
  }
}
