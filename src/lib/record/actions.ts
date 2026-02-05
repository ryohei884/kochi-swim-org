"use server";

import { del, put } from "@vercel/blob";
import { get } from "@vercel/edge-config";

import { auth } from "@/auth";
import type {
  recordApproveSchemaType,
  recordCreateSchemaType,
  recordExcludeSchemaType,
  recordUpdateSchemaType,
} from "@/lib/record/verification";
import { prisma } from "@/prisma";

export async function getList(category: number, poolsize: number, sex: number) {
  const res = await prisma.record.findMany({
    orderBy: [
      {
        style: "asc",
      },
      {
        distance: "asc",
      },
      {
        date: "desc",
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
      valid: true,
      category: category,
      poolsize: poolsize,
      sex: sex,
    },
  });
  return res;
}

export async function getAllList() {
  const res = await prisma.record.findMany({
    orderBy: [
      { poolsize: "asc" },
      { category: "asc" },
      { sex: "asc" },
      {
        style: "asc",
      },
      {
        distance: "asc",
      },
      {
        date: "desc",
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
      valid: true,
    },
  });
  return res;
}

export async function getListAdmin(
  category: number,
  poolsize: number,
  sex: number,
) {
  const res = await prisma.record.findMany({
    where: {
      category: category,
      poolsize: poolsize,
      sex: sex,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
    orderBy: [
      {
        style: "asc",
      },
      {
        distance: "asc",
      },
      {
        date: "desc",
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

export async function getById(id: string) {
  const res = await prisma.record.findFirst({
    where: {
      id: id,
      approved: true,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function getByIdAdmin(id: string) {
  const res = await prisma.record.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, revisedUser: true, approvedUser: true },
  });
  return res;
}

export async function create(prop: recordCreateSchemaType) {
  const data = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    // ここに同種目でより早い記録がないかどうか調べる。
    console.log(data);
    const res = await prisma.record.create({
      include: { createdUser: true, revisedUser: true, approvedUser: true },
      data: {
        ...data,
        image: typeof data.image === "string" ? data.image : null,
        createdUserId: session?.user?.id,
        approved: false,
        valid: true,
      },
    });
    return res;
  }
}

export async function update(prop: recordUpdateSchemaType) {
  const {
    id,
    style,
    time,
    image,
    category,
    poolsize,
    sex,
    distance,
    swimmer1,
    swimmer2,
    swimmer3,
    swimmer4,
    team,
    place,
    date,
    meetName,
    valid,
  } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.record.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Record ID does not exist.");
    } else {
      const res = await prisma.record.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          style: style,
          time: time,
          image: typeof image === "string" ? image : null,
          category: category,
          poolsize: poolsize,
          sex: sex,
          distance: distance,
          swimmer1: swimmer1,
          swimmer2: swimmer2 ?? null,
          swimmer3: swimmer3 ?? null,
          swimmer4: swimmer4 ?? null,
          team: team,
          place: place,
          date: date,
          meetName: meetName,
          valid: valid,
          revisedUserId: session?.user?.id,
          approvedUserId: null,
          approved: false,
        },
      });
      await blobUpdate(contest.category, contest.poolsize, contest.sex);
      if (
        res.category !== contest.category ||
        res.poolsize !== contest.poolsize ||
        res.sex !== contest.sex
      ) {
        await blobUpdate(res.category, res.poolsize, res.sex);
      }
      return res;
    }
  }
}

export async function exclude(prop: recordExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.record.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Record ID does not exist.");
    } else {
      const res = await prisma.record.delete({
        where: {
          id: id,
        },
      });
      await blobUpdate(res.category, res.poolsize, res.sex);
    }
  }
}

export async function approve(prop: recordApproveSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.record.findFirst({
      where: { id: id },
    });

    if (!contest) {
      throw new Error("Record ID does not exist.");
    } else {
      const res = await prisma.record.update({
        where: {
          id: id,
        },
        data: {
          approved: true,
          approvedUserId: session?.user?.id,
          approvedAt: new Date(),
        },
      });
      await blobUpdate(res.category, res.poolsize, res.sex);
    }
  }
}

export async function blobUpdate(
  category: number,
  poolsize: number,
  sex: number,
) {
  try {
    const res = await getList(category, poolsize, sex);
    const oldEdgeConfig = await get(`record_${category}_${poolsize}_${sex}`);

    const blob = await put(
      `data/record_${category}_${poolsize}_${sex}.json`,
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
              key: `record_${category}_${poolsize}_${sex}`,
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
      const regexRecord = /record_\d_\d_\d-*.+\.json/g;
      const urlRecord = oldEdgeConfig.toString().match(regexRecord);
      if (urlRecord !== null) {
        await del(`data/${urlRecord[0]}`);
      }
    }

    // All
    const resAll = await getAllList();
    const oldAllEdgeConfig = await get("record_all");

    const blobAll = await put("data/record_all.json", JSON.stringify(resAll), {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: true,
    });

    const updateAllEdgeConfig = await fetch(
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
              key: "record_all",
              value: blobAll.url,
            },
          ],
        }),
      },
    );
    if (
      oldAllEdgeConfig !== undefined &&
      oldAllEdgeConfig !== null &&
      updateAllEdgeConfig.status === 200
    ) {
      const regexAllRecord = /record_all-*.+\.json/g;
      const urlAllRecord = oldAllEdgeConfig.toString().match(regexAllRecord);
      if (urlAllRecord !== null) {
        await del(`data/${urlAllRecord[0]}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function pdfUpdate(blob: Blob) {
  try {
    // All
    const oldAllEdgeConfig = await get("record_pdf");
    const blobAll = await put("files/record_all.pdf", blob, {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: true,
    });

    const updateAllEdgeConfig = await fetch(
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
              key: "record_pdf",
              value: blobAll.url,
            },
          ],
        }),
      },
    );
    if (
      oldAllEdgeConfig !== undefined &&
      oldAllEdgeConfig !== null &&
      updateAllEdgeConfig.status === 200
    ) {
      const regexAllRecord = /record_all-*.+\.pdf/g;
      const urlAllRecord = oldAllEdgeConfig.toString().match(regexAllRecord);
      if (urlAllRecord !== null) {
        await del(`files/${urlAllRecord[0]}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
