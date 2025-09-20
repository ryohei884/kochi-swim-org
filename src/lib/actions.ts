"use server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

import { formSchemaType as categoryCreateFormSchema } from "@/components/category/create-form";
import { omitCategoryUpdateFormSchemaType } from "@/components/category/update-form";

export async function getCategoryById(id: string) {
  const res = await prisma.category.findFirst({
    where: {
      categoryId: id,
    },
  });
  return res;
}

export async function createCategory(data: categoryCreateFormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      name: "ERROR",
      link: "ERROR",
      order: 0,
      permission: 0,
      categoryId: "ERROR",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdUserId: "ERROR",
    };
  } else {
    const res = await prisma.category.create({
      data: {
        name: data.name,
        link: data.link,
        order: data.order,
        permission: data.permission,
        createdUserId: session?.user?.id,
      },
    });
    return res;
  }
}

export async function updateCategory(data: omitCategoryUpdateFormSchemaType) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      name: "ERROR",
      link: "ERROR",
      order: 0,
      permission: 0,
      categoryId: "ERROR",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdUserId: "ERROR",
    };
  } else {
    const res = await prisma.category.update({
      where: {
        categoryId: data.categoryId,
      },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        link: data.link,
        order: data.order,
        permission: data.permission,
        createdUserId: session?.user?.id,
      },
    });
    return res;
  }
}

export async function getCategoryList() {
  const res = await prisma.category.findMany({
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

export async function deleteCategory(id: string) {
  const res = await prisma.category.delete({
    where: {
      categoryId: id,
    },
  });
  return res;
}
