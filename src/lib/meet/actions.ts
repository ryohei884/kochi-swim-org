"use server";

import { del, put } from "@vercel/blob";
import { get } from "@vercel/edge-config";

import { auth } from "@/auth";
import type {
  meetApproveSchemaType,
  meetCreateSchemaType,
  meetExcludeSchemaType,
  meetGetByIdSchemaType,
  meetUpdateSchemaType,
} from "@/lib/meet/verification";
import { getFY } from "@/lib/utils";
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

export async function getListAdmin(kind: number, year: number) {
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
  });
  return res;
}

export async function getListAdminAll() {
  const res = await prisma.meet.findMany({
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

export async function create(prop: meetCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
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
  });
  return res;
}

export async function getListAll() {
  const res = await prisma.meet.findMany({
    orderBy: [
      {
        createdAt: "asc",
      },
      {
        revisedAt: "asc",
      },
    ],
    where: {
      approved: true,
    },
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
    const contest = await prisma.meet.findFirst({
      where: { id: data.id },
    });

    if (!contest) {
      throw new Error("Meet ID does not exist.");
    } else {
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
      const now = new Date(res.fromDate);
      const year = getFY(now);

      const contestNow = new Date(contest.fromDate);
      const contestYear = getFY(contestNow);
      await blobUpdate(res.kind, year);
      if (res.kind !== contest.kind || year !== contestYear) {
        await blobUpdate(contest.kind, contestYear);
      }

      return res;
    }
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
      const updated = await prisma.meet.delete({
        where: {
          id: id,
        },
      });
      const now = new Date(updated.fromDate);
      const year = getFY(now);
      await blobUpdate(updated.kind, year);
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
      const updated = await prisma.meet.update({
        where: {
          id: id,
        },
        data: {
          approved: true,
          approvedUserId: session?.user?.id,
          approvedAt: new Date(),
        },
      });
      const now = new Date(updated.fromDate);
      const year = getFY(now);
      await blobUpdate(updated.kind, year);
    }
  }
}

export async function blobUpdate(kind: number, year: number) {
  try {
    const res = await getList(kind, year);
    const oldEdgeConfig = await get(`meet_${year}_${kind}`);

    const blob = await put(
      `data/meet_${year}_${kind}.json`,
      JSON.stringify(res),
      {
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: true,
      },
    );
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
              key: `meet_${year}_${kind}`,
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
      const regexMeet = /meet_\d{4}_\d-*.+\.json/g;
      const urlMeet = oldEdgeConfig.toString().match(regexMeet);
      if (urlMeet !== null) {
        await del(`data/${urlMeet[0]}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
