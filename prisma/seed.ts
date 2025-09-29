import { PrismaClient } from "@/app/generated/prisma/edge";
const prisma = new PrismaClient();

type userType = {
  name: string;
  email: string | undefined;
  emailVerified: null;
  image: null;
  role: string;
};

type categoryType = {
  name: string;
  link: string;
  order: number;
  role: number;
};

const user: userType[] = [
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

const category: categoryType[] = [
  {
    name: "お知らせ",
    link: "news",
    order: 1,
    role: 5,
  },
  {
    name: "競技会",
    link: "meet",
    order: 2,
    role: 5,
  },
  {
    name: "イベント",
    link: "event",
    order: 3,
    role: 5,
  },
  {
    name: "県記録",
    link: "record",
    order: 4,
    role: 5,
  },
  {
    name: "連盟情報",
    link: "organization",
    order: 5,
    role: 5,
  },
  {
    name: "直営クラブ",
    link: "club",
    order: 6,
    role: 5,
  },
  {
    name: "スポンサー",
    link: "Sponsor",
    order: 7,
    role: 5,
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

    const administrator = await prisma.user.findFirst({
      where: { role: "administrator" },
    });

    if (administrator) {
      for (let i = 0; i < category.length; i++) {
        await prisma.category.create({
          data: {
            name: category[i].name,
            link: category[i].link,
            order: category[i].order,
            role: category[i].role,
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
