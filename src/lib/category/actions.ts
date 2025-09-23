"use server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import {
  categoryGetByIdSchemaType,
  categoryCreateSchemaType,
  categoryUpdateSchemaType,
  categoryExcludeSchemaType,
} from "@/lib/category/verification";

export async function getById(prop: categoryGetByIdSchemaType) {
  const { categoryId } = prop;

  const res = await prisma.category.findFirst({
    where: {
      categoryId: categoryId,
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
          categoryId: list[i].categoryId,
        },
        data: {
          order: i + 1,
        },
      });
    }
  });
}

export async function create(prop: categoryCreateSchemaType) {
  const { name, link, order, permission } = prop;
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
        permission: permission,
        createdUserId: session?.user?.id,
        updatedUserId: null,
      },
    });
    return res;
  }
}

export async function update(prop: categoryUpdateSchemaType) {
  const { categoryId, name, link, order, permission, createdUserId } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.category.findFirst({
      where: { categoryId: categoryId },
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
          categoryId: categoryId,
        },
        data: {
          categoryId: categoryId,
          name: name,
          link: link,
          order: order,
          permission: permission,
          createdUserId: createdUserId,
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

export async function getList() {
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
}

export async function exclude(prop: categoryExcludeSchemaType) {
  const { categoryId } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.category.findFirst({
      where: { categoryId: categoryId },
      include: {
        createdUser: true,
        updatedUser: true,
      },
    });

    if (!contest) {
      throw new Error("Category ID does not exist.");
    } else {
      const res = await prisma.category.delete({
        where: {
          categoryId: categoryId,
        },
      });

      return res;
    }
  }
}
