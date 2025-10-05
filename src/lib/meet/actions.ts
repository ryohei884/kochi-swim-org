"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { meetCreateSchemaType } from "@/lib/meet/verification";

export async function getList(kind?: number, page?: number) {
  const res = await prisma.meet.findMany({
    where: {
      kind: kind ? kind : undefined,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    orderBy: [
      {
        fromDate: "asc",
      },
      {
        toDate: "asc",
      },
      {
        createdAt: "asc",
      },
      {
        revisedAt: "asc",
      },
    ],
    skip: page ? (page - 1) * 10 : undefined,
    take: page ? 10 : undefined,
  });
  return res;
}

export async function create(prop: meetCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.meet.create({
      include: { createdUser: true, revisedUser: true, approvedUser: true },
      data: {
        code: data.code || null,
        kind: Number(data.kind),
        title: data.title,
        fromDate: data.fromDate,
        toDate: data.toDate,
        deadline: data.deadline,
        place: data.place,
        poolsize: Number(data.poolsize) || 0,
        result: data.result,
        description: data.description,
        detail: data.detail?.[0].name || null,
        attachment: data.attachment?.[0].name || null,
        createdUserId: session?.user?.id,
        approved: false,
      },
    });
    return res;
  }
}

export async function getListNum(kind?: number) {
  const res = await prisma.meet.count({
    where: {
      kind: kind ? kind : undefined,
      approved: true,
      fromDate: {
        lt: new Date(),
      },
      toDate: {
        gte: new Date(),
      },
    },
  });
  return res;
}
