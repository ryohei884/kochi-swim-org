"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getList as getCategoryList } from "@/lib/category/actions";
import { cache } from "react";

export const getPermissionListAll = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  } else {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!isUserExist) {
      throw new Error("There is no such a user.");
    } else {
      const groups = await prisma.groupMember.findMany({
        where: {
          userId: session.user.id,
        },
      });

      if (groups) {
        const permission = await Promise.all(
          groups.map(async (grp_value) => {
            const pms = await prisma.permission.findMany({
              where: {
                groupId: grp_value.groupId,
              },
              include: {
                category: true,
                group: true,
              },
            });

            const res = await Promise.all(
              pms.map(async (pms_value) => {
                return {
                  userId: grp_value.userId,
                  groupId: grp_value.groupId,
                  groupName: pms_value.group.name,
                  categoryId: pms_value.categoryId,
                  categoryLink: pms_value.category.link,
                  categoryName: pms_value.category.name,
                  view: pms_value.view,
                  submit: pms_value.submit,
                  revise: pms_value.revise,
                  exclude: pms_value.exclude,
                  approve: pms_value.approve,
                };
              }),
            );

            return res;
          }),
        );

        return permission.flat(2);
      } else {
        return [];
      }
    }
  }
});

export const getPermissionList = cache(async () => {
  const res = await getPermissionListAll();
  if (res !== null) {
    const category = await getCategoryList();
    const permissions = category.map((cat) => {
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        categoryLink: cat.link,
        view:
          res.filter((v) => v.categoryId === cat.id && v.view === true).length >
          0
            ? true
            : false,
        submit:
          res.filter((v) => v.categoryId === cat.id && v.submit === true)
            .length > 0
            ? true
            : false,
        revise:
          res.filter((v) => v.categoryId === cat.id && v.revise === true)
            .length > 0
            ? true
            : false,
        exclude:
          res.filter((v) => v.categoryId === cat.id && v.exclude === true)
            .length > 0
            ? true
            : false,
        approve:
          res.filter((v) => v.categoryId === cat.id && v.approve === true)
            .length > 0
            ? true
            : false,
      };
    });
    return permissions;
  } else {
    return [];
  }
});

type GetApproverListProps = {
  categoryLink: string;
};
export const getApproverList = cache(async (props: GetApproverListProps) => {
  const { categoryLink } = props;
  const category = await prisma.category.findMany({
    where: {
      link: categoryLink,
    },
  });

  const permission = await Promise.all(
    category.map(async (cat_value) => {
      const pms = await prisma.permission.findMany({
        where: {
          categoryId: cat_value.id,
          approve: true,
        },
      });
      return pms;
    }),
  );

  const approver = await Promise.all(
    permission.flat(2).map(async (pms_value) => {
      const apv = await prisma.groupMember.findMany({
        where: {
          groupId: pms_value.groupId,
        },
        include: {
          user: true,
        },
      });
      return apv;
    }),
  );

  const approverList = approver.flat(2).map((v) => {
    return {
      userId: v.userId,
      userDisplayName: v.user.displayName,
      userName: v.user.name,
    };
  });

  const uniqueApprovers = Array.from(
    new Map(approverList.map((user) => [user.userId, user])).values(),
  );

  return uniqueApprovers;
});
