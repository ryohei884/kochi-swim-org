"use server";
import { prisma } from "@/prisma";

export async function getList() {
  const res = await prisma.account.findMany({
    where: {
      provider: "line",
      user: {
        role: "administrator",
      },
    },
    include: { user: true },
  });
  return res;
}
