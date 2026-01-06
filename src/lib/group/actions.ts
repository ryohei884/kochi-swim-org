"use server";
import { auth } from "@/auth";
import type {
  groupCreateSchemaType,
  groupExcludeSchemaType,
  groupGetByIdSchemaType,
  groupMemberSchemaType,
  groupUpdateSchemaType,
  memberSchemaType,
  permissionGetSchemaType,
  permissionSchemaType,
  permissionUpdateSchemaType,
  updateMemberSchemaType,
  userSchemaType,
} from "@/lib/group/verification";
import { prisma } from "@/prisma";

export async function getById(prop: groupGetByIdSchemaType) {
  const { id } = prop;

  const res = await prisma.group.findFirst({
    where: {
      id: id,
    },
    include: { createdUser: true, updatedUser: true },
  });
  return res;
}

export async function create(prop: groupCreateSchemaType) {
  const { name } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const res = await prisma.group.create({
      include: { createdUser: true, updatedUser: true },
      data: {
        name: name,
        createdUserId: session?.user?.id,
        updatedUserId: null,
      },
    });
    return res;
  }
}

export async function update(prop: groupUpdateSchemaType) {
  const { id, name } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.group.findFirst({
      where: { id: id },
      include: {
        createdUser: true,
        updatedUser: true,
      },
    });

    if (!contest) {
      throw new Error("Group ID does not exist.");
    } else {
      const res = await prisma.group.update({
        where: {
          id: id,
        },
        data: {
          id: id,
          name: name,
          updatedUserId: session?.user?.id,
        },
      });

      const response = {
        createdUser: contest.createdUser,
        updatedUser: contest.updatedUser ?? null,
        ...res,
      };
      return response;
    }
  }
}

export async function getList() {
  const res = await prisma.group.findMany({
    include: { createdUser: true, updatedUser: true },
    orderBy: [
      {
        createdAt: "asc",
      },
      {
        updatedAt: "asc",
      },
    ],
  });
  return res;
}

export async function exclude(prop: groupExcludeSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const contest = await prisma.group.findFirst({
      where: { id: id },
      include: {
        createdUser: true,
        updatedUser: true,
      },
    });

    if (!contest) {
      throw new Error("Group ID does not exist.");
    } else {
      await prisma.group.delete({
        where: {
          id: id,
        },
      });
    }
  }
}

export async function get_member(prop: memberSchemaType) {
  const { id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    let member_list: groupMemberSchemaType[] = [];
    let user_list: userSchemaType[] = [];
    const ml = await prisma.$transaction(async (prisma) => {
      member_list = await prisma.groupMember.findMany({
        where: {
          groupId: id,
        },
      });

      if (!member_list) throw Error("There is no group data.");

      user_list = await prisma.user.findMany({});

      if (!user_list) throw Error("There is no user data.");

      return member_list.map((value) => {
        return value.userId;
      });
    });

    return { member_list: ml, user_list: user_list };
  }
}

export async function update_member(prop: updateMemberSchemaType) {
  const { users, id } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    let member_list: groupMemberSchemaType[] = [];
    let user_list: userSchemaType[] = [];
    await prisma.$transaction(async (prisma) => {
      member_list = await prisma.groupMember.findMany({
        where: {
          groupId: id,
        },
      });

      if (!member_list) throw Error("There is no group data.");
      user_list = await prisma.user.findMany({});

      if (!user_list) throw Error("There is no user data.");

      if (users !== undefined && users !== null) {
        // メンバーではなかったがメンバーになった人
        const newMembers = users
          .map((user) => {
            const isMl = member_list
              .map((member) => {
                return member.userId;
              })
              .includes(user);
            return isMl ? null : user;
          })
          .filter((v) => Boolean(v));

        for (let i = 0; i < newMembers.length; i++) {
          if (newMembers[i] !== null) {
            await prisma.groupMember.create({
              data: {
                userId: String(newMembers[i]),
                groupId: id,
                createdUserId: session?.user?.id ? session?.user?.id : "",
              },
            });
          }
        }
      }

      // メンバーだったがメンバーから外された人
      const excluded = user_list.map((user) => {
        const isUser = users?.includes(user.id);
        return isUser ? null : user.id;
      });

      const newExcluded = excluded
        .map((user) => {
          const isUser = user
            ? member_list
                .map((member) => {
                  return member.userId;
                })
                .includes(user)
            : false;
          return isUser ? user : null;
        })
        .filter((v) => Boolean(v));

      for (let i = 0; i < newExcluded.length; i++) {
        if (newExcluded[i] !== null) {
          await prisma.groupMember.delete({
            where: {
              groupId_userId: {
                userId: String(newExcluded[i]),
                groupId: id,
              },
            },
          });
        }
      }
    });

    return null;
  }
}

export async function get_permission(prop: permissionGetSchemaType) {
  const { groupId } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    let permission_list: permissionSchemaType[] = [];

    const ml = await prisma.$transaction(async (prisma) => {
      permission_list = await prisma.permission.findMany({
        where: {
          groupId: groupId,
        },
      });

      if (!permission_list) throw Error("There is no group data.");
      return permission_list;
    });

    return { permission_list: ml };
  }
}

export async function update_permission(prop: permissionUpdateSchemaType) {
  const { data } = prop;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    console.log(data);
    const ml = await prisma.$transaction(async (prisma) => {
      await prisma.permission.deleteMany({
        where: {
          groupId: String(data[0].groupId),
        },
      });

      for (let i = 0; i < data.length; i++) {
        if (data[i] !== null) {
          await prisma.permission.create({
            data: {
              groupId: String(data[0].groupId),
              categoryId: String(data[i].categoryId),
              view: data[i].permission?.includes("view"),
              submit: data[i].permission?.includes("submit"),
              revise: data[i].permission?.includes("revise"),
              exclude: data[i].permission?.includes("exclude"),
              approve: data[i].permission?.includes("approve"),
              createdUserId: session?.user?.id ? session?.user?.id : "",
            },
          });
        }
      }
    });

    return { permission_list: ml };
  }
}
