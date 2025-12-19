"use server";

import { del, put } from "@vercel/blob";
import { get } from "@vercel/edge-config";

import { auth } from "@/auth";
import type {
  seminarApproveSchemaType,
  seminarCreateSchemaType,
  seminarExcludeSchemaType,
  seminarGetByIdSchemaType,
  seminarUpdateSchemaType,
} from "@/lib/seminar/verification";
import { prisma } from "@/prisma";

export async function getList(year?: number) {
  const now = new Date();
  const thisYear = year
    ? Number(year)
    : now.getMonth() <= 3 && now.getDate() <= 31
      ? now.getFullYear() - 1
      : now.getFullYear();
  const nextYear = thisYear + 1;
  const res = await prisma.seminar.findMany({
    where: {
      approved: true,
      fromDate: {
        gte: new Date(`${thisYear}/4/1`),
        lte: new Date(`${nextYear}/3/31`),
      },
    },
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
  });
  return res;
}

export async function getListAdmin(year?: number) {
  const nextYear = year ? Number(year) + 1 : 0;
  const res = await prisma.seminar.findMany({
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    where: year
      ? {
          fromDate: {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          },
        }
      : undefined,
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
        approvedUserId: data.approvedUserId,
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

export async function getListNumAdmin(year?: number) {
  const nextYear = year ? Number(year) + 1 : 0;
  const res = await prisma.seminar.count({
    where: year
      ? {
          fromDate: {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          },
        }
      : undefined,
  });
  return res;
}

export async function getById(prop: seminarGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.seminar.findFirst({
    where: {
      id: id,
      approved: true,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function getByIdAdmin(prop: seminarGetByIdSchemaType) {
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
        approvedUserId: data.approvedUserId,
        approved: false,
      },
    });
    const now = new Date(res.fromDate);
    const year =
      now.getMonth() <= 3 && now.getDate() <= 31
        ? now.getFullYear() - 1
        : now.getFullYear();
    await blobUpdate(year);
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
      const res = await prisma.seminar.delete({
        where: {
          id: id,
        },
      });
      const now = new Date(res.fromDate);
      const year =
        now.getMonth() <= 3 && now.getDate() <= 31
          ? now.getFullYear() - 1
          : now.getFullYear();
      await blobUpdate(year);
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
      const res = await prisma.seminar.update({
        where: {
          id: id,
        },
        data: {
          approved: true,
          approvedUserId: session?.user?.id,
          approvedAt: new Date(),
        },
      });
      const now = new Date(res.fromDate);
      const year =
        now.getMonth() <= 3 && now.getDate() <= 31
          ? now.getFullYear() - 1
          : now.getFullYear();
      await blobUpdate(year);
    }
  }
}

export async function blobUpdate(year: number) {
  try {
    const res = await getList(year);
    const oldEdgeConfig = await get(`seminar_${year}`);

    const blob = await put(`data/seminar_${year}.json`, JSON.stringify(res), {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: true,
    });
    const updateEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.EDGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: `seminar_${year}`,
              value: blob.url,
            },
          ],
        }),
      },
    );

    if (
      oldEdgeConfig !== undefined &&
      oldEdgeConfig !== null &&
      updateEdgeConfig.status === 200
    ) {
      const regexSeminar = /seminar_\d{4}-*.+\.json/g;
      const urlSeminar = oldEdgeConfig.toString().match(regexSeminar);
      if (urlSeminar !== null) {
        await del(`data/${urlSeminar[0]}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
