"use server";

import { auth } from "@/auth";
import type {
  meetApproveSchemaType,
  meetCreateSchemaType,
  meetExcludeSchemaType,
  meetGetByIdSchemaType,
  meetUpdateSchemaType,
} from "@/lib/meet/verification";
import { prisma } from "@/prisma";

export async function getList(kind: number, year: number) {
  const nextYear: number = Number(year) + 1;
  const res = await prisma.meet.findMany({
    where: {
      fromDate: year
        ? {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          }
        : undefined,
      kind: kind ? kind : undefined,
      approved: true,
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
  });
  return res;
}

export async function getListAdmin(kind: number, year: number, page: number) {
  const nextYear: number = Number(year) + 1;
  const res = await prisma.meet.findMany({
    where: {
      fromDate: year
        ? {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          }
        : undefined,
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

export async function getListPageAdmin(id: string) {
  const meet = await getById({ id: id });

  if (meet !== null) {
    const fromDate =
      meet.fromDate.getMonth() <= 3 && meet.fromDate.getDate() <= 31
        ? meet.fromDate.getFullYear() - 1
        : meet.fromDate.getFullYear();

    const res = await prisma.meet.count({
      where: {
        fromDate: {
          gte: new Date(`${fromDate}/4/1`),
          lte: meet.fromDate,
        },
        kind: meet.kind,
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
  } else {
    return 0;
  }
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
        detail: data.detail !== "[]" ? data.detail : null,
        attachment: data.attachment !== "[]" ? data.attachment : null,
        createdUserId: session?.user?.id,
        approvedUserId: data.approvedUserId,
        approved: false,
      },
    });
    return res;
  }
}

export async function getListNum(kind: number, year: number) {
  const nextYear: number = Number(year) + 1;
  const res = await prisma.meet.count({
    where: {
      fromDate: year
        ? {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          }
        : undefined,
      kind: kind ? kind : undefined,
      approved: true,
    },
  });
  return res;
}

export async function getListNumAdmin(kind: number, year: number) {
  const nextYear: number = Number(year) + 1;
  const res = await prisma.meet.count({
    where: {
      fromDate: year
        ? {
            gte: new Date(`${year}/4/1`),
            lte: new Date(`${nextYear}/3/31`),
          }
        : undefined,
      kind: kind ? kind : undefined,
    },
  });
  return res;
}

export async function getById(prop: meetGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.meet.findFirst({
    where: {
      id: id,
      approved: true,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function getByIdAdmin(prop: meetGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.meet.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function update(prop: meetUpdateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.meet.update({
      where: {
        id: data.id,
      },
      data: {
        id: data.id,
        code: data.code,
        kind: Number(data.kind),
        title: data.title,
        fromDate: data.fromDate,
        toDate: data.toDate,
        deadline: data.deadline,
        place: data.place,
        poolsize: Number(data.poolsize) || 0,
        result: data.result,
        description: data.description,
        detail: data.detail !== "[]" ? data.detail : null,
        attachment: data.attachment !== "[]" ? data.attachment : null,
        revisedUserId: session?.user?.id,
        approvedUserId: data.approvedUserId,
        approved: false,
      },
    });
    edgeUpdate();
    return res;
  }
}

export async function exclude(prop: meetExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.meet.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Meet ID does not exist.");
    } else {
      await prisma.meet.delete({
        where: {
          id: id,
        },
      });
      edgeUpdate();
    }
  }
}

export async function approve(prop: meetApproveSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.meet.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Meet ID does not exist.");
    } else {
      await prisma.meet.update({
        where: {
          id: id,
        },
        data: {
          approved: true,
          approvedUserId: session?.user?.id,
          approvedAt: new Date(),
        },
      });
      edgeUpdate();
    }
  }
}

export async function edgeUpdate() {
  const now = new Date();
  const year =
    now.getMonth() <= 3 && now.getDate() <= 31
      ? now.getFullYear() - 1
      : now.getFullYear();
  const res = await getList(1, year);

  try {
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
              key: "meet_list_top",
              value: res,
            },
          ],
        }),
      },
    );
    const result = await updateEdgeConfig.json();
    console.log(result);
  } catch (error) {
    console.log(error);
    const createEdgeConfig = await fetch(
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
              operation: "create",
              key: "meet_list_top",
              value: res,
            },
          ],
        }),
      },
    );
    const result = await createEdgeConfig.json();
    console.log(result);
  }
}
