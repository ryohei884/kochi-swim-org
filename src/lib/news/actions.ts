"use server";
import type {
  newsCreateSchemaType,
  newsGetByIdSchemaType,
  newsUpdateSchemaType,
  newsExcludeSchemaType,
  newsApproveSchemaType,
} from "@/lib/news/verification";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function getList() {
  const res = await prisma.news.findMany({
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    orderBy: [
      {
        order: "asc",
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
        image: typeof data.image === "string" ? data.image : null,
        fromDate: data.fromDate,
        toDate: data.toDate,
        link: data.link,
        order: data.order,
        createdUserId: session?.user?.id,
        approved: false,
      },
    });
    return res;
  }
}

export async function getById(prop: newsGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.news.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function update(prop: newsUpdateSchemaType) {
  const { id, title, detail, image, fromDate, toDate, link, order } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.news.findFirst({
      where: { id: id },
      include: {
        createdUser: true,
      },
    });

    if (!contest) {
      throw new Error("News ID does not exist.");
    } else {
      const res = await prisma.news.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          title: title,
          detail: detail,
          image: typeof image === "string" ? image : null,
          fromDate: fromDate,
          toDate: toDate,
          link: link,
          order: order,
          revisedUserId: session?.user?.id,
          approvedUserId: null,
          approved: false,
        },
      });
      return res;
    }
  }
}

export async function exclude(prop: newsExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.news.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("News ID does not exist.");
    } else {
      await prisma.news.delete({
        where: {
          id: id,
        },
      });
    }
  }
}

export async function approve(prop: newsApproveSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.news.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("News ID does not exist.");
    } else {
      await prisma.news.update({
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

export async function reOrder() {
  await prisma.$transaction(async (prisma) => {
    const list = await prisma.news.findMany({
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
        {
          revisedAt: "asc",
        },
      ],
    });

    if (!list) throw Error("There is no news data.");

    for (let i = 0; i < list.length; i++) {
      await prisma.news.update({
        where: {
          id: list[i].id,
        },
        data: {
          order: i + 1,
        },
      });
    }
  });
}
