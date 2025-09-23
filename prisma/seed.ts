import { PrismaClient } from "@/app/generated/prisma/edge";
const prisma = new PrismaClient();
export type userType = {
  name: string;
  email: string | undefined;
  emailVerified: null;
  image: null;
  role: string;
};

export type categoryType = {
  name: string;
  link: string;
  order: number;
  permission: number;
};

export const user: userType[] = [
  {
    name: "管理者",
    email: process.env.PRISMA_ADMINISTRATOR_EMAIL,
    emailVerified: null,
    image: null,
    role: "administrator",
  },
  {
    name: "承認者",
    email: process.env.PRISMA_APPROVER_EMAIL,
    emailVerified: null,
    image: null,
    role: "approver",
  },
  {
    name: "編集者",
    email: process.env.PRISMA_EDITOR_EMAIL,
    emailVerified: null,
    image: null,
    role: "editor",
  },
];

export const category: categoryType[] = [
  {
    name: "お知らせ",
    link: "news",
    order: 1,
    permission: 5,
  },
  {
    name: "競技会",
    link: "meet",
    order: 2,
    permission: 5,
  },
  {
    name: "イベント",
    link: "event",
    order: 3,
    permission: 5,
  },
  {
    name: "県記録",
    link: "record",
    order: 4,
    permission: 5,
  },
  {
    name: "連盟情報",
    link: "organization",
    order: 5,
    permission: 5,
  },
  {
    name: "直営クラブ",
    link: "club",
    order: 6,
    permission: 5,
  },
  {
    name: "スポンサー",
    link: "Sponsor",
    order: 7,
    permission: 5,
  },
];

async function main() {
  await prisma.$transaction(async (prisma) => {
    for (let i = 0; i < user.length; i++) {
      if (!user[i].email) {
        throw new Error(`user[${i}].email does not exist in .env`);
      } else {
        await prisma.user.upsert({
          where: { email: user[i].email },
          update: {},
          create: {
            name: user[i].name,
            email: user[i].email ?? "",
            emailVerified: null,
            image: null,
            role: user[i].role,
          },
        });
      }
    }
    /*
    if (!process.env.PRISMA_ADMINISTRATOR_EMAIL) {
      throw new Error("PRISMA_ADMINISTRATOR_EMAIL does not exist in .env");
    } else {
      await prisma.user.upsert({
        where: { email: process.env.PRISMA_ADMINISTRATOR_EMAIL },
        update: {},
        create: {
          name: "管理者",
          email: process.env.PRISMA_ADMINISTRATOR_EMAIL,
          emailVerified: null,
          image: null,
          role: "administrator",
        },
      });
    }

    if (!process.env.PRISMA_APPROVER_EMAIL) {
      throw new Error("PRISMA_APPROVER_EMAIL does not exist in .env");
    } else {
      await prisma.user.upsert({
        where: { email: process.env.PRISMA_APPROVER_EMAIL },
        update: {},
        create: {
          name: "承認者",
          email: process.env.PRISMA_APPROVER_EMAIL,
          emailVerified: null,
          image: null,
          role: "approver",
        },
      });
    }

    if (!process.env.PRISMA_EDITOR_EMAIL) {
      throw new Error("PRISMA_APPROVER_EMAIL does not exist in .env");
    } else {
      await prisma.user.upsert({
        where: { email: process.env.PRISMA_EDITOR_EMAIL },
        update: {},
        create: {
          name: "編集者",
          email: process.env.PRISMA_EDITOR_EMAIL,
          emailVerified: null,
          image: null,
          role: "editor",
        },
      });
    }
      */

    const administrator = await prisma.user.findFirst({
      where: { role: "administrator" },
    });

    // const category = [
    //   {
    //     name: "お知らせ",
    //     link: "news",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "競技会",
    //     link: "meet",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "イベント",
    //     link: "event",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "県記録",
    //     link: "record",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "連盟情報",
    //     link: "organization",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "直営クラブ",
    //     link: "club",
    //     order: 1,
    //     permission: 5,
    //   },
    //   {
    //     name: "スポンサー",
    //     link: "Sponsor",
    //     order: 1,
    //     permission: 5,
    //   },
    // ];

    if (administrator) {
      for (let i = 0; i < category.length; i++) {
        await prisma.category.create({
          data: {
            name: category[i].name,
            link: category[i].link,
            order: category[i].order,
            permission: category[i].permission,
            createdUserId: administrator.id,
          },
        });
      }
    }
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
