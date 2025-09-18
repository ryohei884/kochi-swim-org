"use server";
import { prisma } from "@/prisma";

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
  const res = await prisma.category.create({
    data: {
      name: data.name,
      link: data.link,
      order: data.order,
      permission: data.permission,
    },
  });
  return res;
}

export async function updateCategory(data: omitCategoryUpdateFormSchemaType) {
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
    },
  });
  return res;
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
