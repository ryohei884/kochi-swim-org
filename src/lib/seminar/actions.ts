"use server";

import type {
  seminarCreateSchemaType,
  seminarGetByIdSchemaType,
  seminarUpdateSchemaType,
  seminarExcludeSchemaType,
  seminarApproveSchemaType,
} from "@/lib/seminar/verification";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getList(page?: number) {
  const res = await prisma.seminar.findMany({
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

export async function create(prop: seminarCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.seminar.create({
      include: { createdUser: true, revisedUser: true, approvedUser: true },
      data: {
        title: data.title,
        fromDate: data.fromDate,
        toDate: data.toDate,
        deadline: data.deadline,
        place: data.place,
        description: data.description,
        detail: data.detail !== "[]" ? data.detail : null,
        attachment: data.attachment !== "[]" ? data.attachment : null,
        createdUserId: session?.user?.id,
        approved: false,
      },
    });
    return res;
  }
}

export async function getListNum() {
  const res = await prisma.seminar.count({
    where: {
      approved: true,
    },
  });
  return res;
}

export async function getById(prop: seminarGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.seminar.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function update(prop: seminarUpdateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.seminar.update({
      where: {
        id: data.id,
      },
      data: {
        id: data.id,
        title: data.title,
        fromDate: data.fromDate,
        toDate: data.toDate,
        deadline: data.deadline,
        place: data.place,
        description: data.description,
        detail: data.detail !== "[]" ? data.detail : null,
        attachment: data.attachment !== "[]" ? data.attachment : null,
        revisedUserId: session?.user?.id,
        approvedUserId: null,
        approved: false,
      },
    });
    return res;
  }
}

export async function exclude(prop: seminarExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.seminar.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Seminar ID does not exist.");
    } else {
      await prisma.seminar.delete({
        where: {
          id: id,
        },
      });
    }
  }
}

export async function approve(prop: seminarApproveSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.seminar.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Seminar ID does not exist.");
    } else {
      await prisma.seminar.update({
        where: {
          id: id,
        },
        data: {
          approved: true,
          approvedUserId: session?.user?.id,
          approvedAt: new Date(),
        },
      });
    }
  }
}
