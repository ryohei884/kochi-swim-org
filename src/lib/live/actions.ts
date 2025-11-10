"use server";

import type {
  liveCreateSchemaType,
  liveUpdateSchemaType,
  liveGetByIdSchemaType,
  liveExcludeSchemaType,
} from "@/lib/live/verification";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getList(page?: number) {
  const res = await prisma.live.findMany({
    where: { OR: [{ onAir: true }, { finished: true }] },
    include: { createdUser: true, meet: true },
    orderBy: [
      {
        order: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    skip: page ? (page - 1) * 10 : undefined,
    take: page ? 10 : undefined,
  });
  return res;
}

export async function getListAdmin(page?: number) {
  const res = await prisma.live.findMany({
    include: { createdUser: true, meet: true },
    orderBy: [
      {
        order: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    skip: page ? (page - 1) * 10 : undefined,
    take: page ? 10 : undefined,
  });
  return res;
}

export async function getListNum() {
  const res = await prisma.live.count({
    where: { OR: [{ onAir: true }, { finished: true }] },
  });
  return res;
}

export async function getListAdminNum() {
  const res = await prisma.live.count();
  return res;
}

export async function create(prop: liveCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const res = await prisma.live.create({
      include: { createdUser: true, meet: true },
      data: {
        title: data.title,
        fromDate: data.fromDate,
        meetId: data.meetId || null,
        onAir: data.onAir,
        url: data.url || null,
        order: data.order,
        finished: data.finished,
        createdUserId: session?.user?.id,
      },
    });
    return res;
  }
}

export async function getById(prop: liveGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.live.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, meet: true },
  });
  return res;
}

export async function update(prop: liveUpdateSchemaType) {
  const { id, title, fromDate, meetId, onAir, url, order, finished } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.live.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Live ID does not exist.");
    } else {
      const res = await prisma.live.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          title: title,
          fromDate: fromDate,
          meetId: meetId || null,
          onAir: onAir,
          url: url || null,
          order: order,
          finished: finished,
        },
      });
      return res;
    }
  }
}

export async function exclude(prop: liveExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.live.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Live ID does not exist.");
    } else {
      await prisma.live.delete({
        where: {
          id: id,
        },
      });
    }
  }
}

export async function getLiveNow() {
  const res = await prisma.live.findFirst({
    where: {
      onAir: true,
    },
    include: { createdUser: true, meet: true },
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

export async function reOrder() {
  const list = await prisma.live.findMany({
    where: {
      order: { gt: 0 },
    },
    orderBy: [
      {
        order: "desc",
      },
      {
        fromDate: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  if (!list) throw Error("There is no live data.");

  await Promise.all(
    list.map(async (l, index) => {
      if (l.order !== index + 1) {
        await prisma.live.update({
          where: {
            id: l.id,
          },
          data: {
            order: index + 1,
          },
        });
      }
    }),
  );
}
