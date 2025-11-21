"use server";
import { auth } from "@/auth";
import type {
  recordApproveSchemaType,
  recordCreateSchemaType,
  recordExcludeSchemaType,
  recordUpdateSchemaType,
} from "@/lib/record/verification";
import { prisma } from "@/prisma";

export async function getList(page?: number) {
  const res = await prisma.record.findMany({
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
    where: {
      approved: true,
      valid: true,
    },
    skip: page ? (page - 1) * 10 : undefined,
    take: page ? 10 : undefined,
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
      include: {
        createdUser: true,
      },
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
      await prisma.record.delete({
        where: {
          id: id,
        },
      });
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
      await prisma.record.update({
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
