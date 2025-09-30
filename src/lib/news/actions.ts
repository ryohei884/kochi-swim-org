"use server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { newsCreateSchemaType } from "@/lib/news/verification";

export async function getList() {
  const res = await prisma.news.findMany({
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    orderBy: [
      {
        createdAt: "asc",
      },
      {
        revisedAt: "asc",
      },
    ],
  });
  return res;
}

export async function create(prop: newsCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.news.create({
      include: { createdUser: true, revisedUser: true, approvedUser: true },
      data: {
        title: data.title,
        detail: data.detail,
        image: data.image,
        fromDate: data.fromDate,
        toDate: data.toDate,
        link: data.link,
        createdUserId: session?.user?.id,
        approved: false,
      },
    });
    return res;
  }
}
