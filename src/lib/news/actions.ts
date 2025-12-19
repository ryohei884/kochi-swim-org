"use server";

import { del, put } from "@vercel/blob";
import { get } from "@vercel/edge-config";

import { auth } from "@/auth";
import type {
  newsApproveSchemaType,
  newsCreateSchemaType,
  newsExcludeSchemaType,
  newsGetByIdSchemaType,
  newsUpdateSchemaType,
} from "@/lib/news/verification";
import { prisma } from "@/prisma";

export async function getList(page?: number) {
  const res = await prisma.news.findMany({
    orderBy: [
      {
        order: "desc",
      },
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
    skip: page ? (page - 1) * 10 : undefined,
    take: page ? 10 : undefined,
  });
  return res;
}

export async function getListAdmin(page?: number) {
  const res = await prisma.news.findMany({
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    orderBy: [
      {
        order: "desc",
      },
      {
        createdAt: "asc",
      },
      {
        revisedAt: "asc",
      },
    ],
    skip: page ? (page - 1) * 10 : undefined,
    take: 10,
  });
  return res;
}

export async function getListNum() {
  const res = await prisma.news.count({
    where: {
      approved: true,
      fromDate: {
        lt: new Date(),
      },
      OR: [
        {
          toDate: {
            gte: new Date(),
          },
        },
        { toDate: null },
      ],
    },
  });
  return res;
}

export async function getListNumAdmin() {
  const res = await prisma.news.count({
    // where: {
    //   fromDate: {
    //     lt: new Date(),
    //   },
    //   toDate: {
    //     gte: new Date(),
    //   },
    // },
  });
  return res;
}

export async function getList3() {
  const res = await prisma.news.findMany({
    where: {
      approved: true,
    },
    orderBy: [
      {
        order: "desc",
      },
      {
        createdAt: "asc",
      },
      {
        revisedAt: "asc",
      },
    ],
    take: 3,
  });
  return res;
}

export async function create(prop: newsCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const res = await prisma.news.create({
      include: { createdUser: true, revisedUser: true, approvedUser: true },
      data: {
        title: data.title,
        detail: data.detail,
        image: typeof data.image === "string" ? data.image : null,
        fromDate: data.fromDate,
        toDate: data.toDate,
        linkCategory: data.linkCategory,
        linkString: data.linkString,
        order: data.order,
        createdUserId: session?.user?.id,
        approvedUserId: data.approvedUserId,
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
      approved: true,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function getByIdAdmin(prop: newsGetByIdSchemaType) {
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
  const {
    id,
    title,
    detail,
    image,
    fromDate,
    toDate,
    linkCategory,
    linkString,
    order,
    approvedUserId,
  } = prop;
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
          linkCategory: linkCategory,
          linkString: linkString,
          order: order,
          revisedUserId: session?.user?.id,
          approvedUserId: approvedUserId,
          approved: false,
        },
      });
      await blobUpdate(-1);
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

      await blobUpdate(-1);
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

      await blobUpdate(1);
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

    await Promise.all(
      list.map(async (l, index) => {
        if (l.order !== index + 1) {
          await prisma.news.update({
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
  });

  await blobUpdate(0);
}

export async function blobUpdate(num_fix: number) {
  const res_list_top = await getList(1);
  const res_list_3 = await getList3();
  const num = await getListNum();

  try {
    const oldEdgeConfigLT = await get("news_list_top");
    const oldEdgeConfigL3 = await get("news_list_3");

    const blob_top = await put(
      `data/news_list_top.json`,
      JSON.stringify(res_list_top),
      {
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: true,
      },
    );

    const blob_3 = await put(
      `data/news_list_3.json`,
      JSON.stringify(res_list_3),
      {
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: true,
      },
    );

    const entry_num = num + num_fix;
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
              key: "news_list_top",
              value: blob_top.url,
            },
            {
              operation: "update",
              key: "news_list_3",
              value: blob_3.url,
            },
            {
              operation: "update",
              key: "news_list_num",
              value: entry_num,
            },
          ],
        }),
      },
    );

    if (updateEdgeConfig.status === 200) {
      if (oldEdgeConfigLT !== undefined && oldEdgeConfigLT !== null) {
        const regexLT = /news_list_top-*.+\.json/g;
        const urlLT = oldEdgeConfigLT.toString().match(regexLT);
        if (urlLT !== null) {
          await del(`data/${urlLT[0]}`);
        }
      }

      if (oldEdgeConfigL3 !== undefined && oldEdgeConfigL3 !== null) {
        const regexL3 = /news_list_3-*.+\.json/g;
        const urlL3 = oldEdgeConfigL3.toString().match(regexL3);
        if (urlL3 !== null) {
          await del(`data/${urlL3[0]}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
