import { PrismaClient } from "@/app/generated/prisma/edge";
import { newsSchemaType } from "@/lib/news/verification";
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

type newsType = {
  title: string;
  detail: string;
  image: string | null;
  fromDate: Date;
  toDate: Date | null;
  link: number | null;
  createdAt: Date;
  revisedAt: Date;
  approvedAt: Date;
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
    name: "ユーザー管理",
    link: "user",
    order: 0,
    role: 2,
  },
  {
    name: "お知らせ",
    link: "news",
    order: 1,
    role: 4,
  },
  {
    name: "競技会情報",
    link: "meet",
    order: 2,
    role: 4,
  },
  {
    name: "ライブ配信",
    link: "live",
    order: 3,
    role: 4,
  },
  {
    name: "県記録",
    link: "record",
    order: 4,
    role: 4,
  },
  {
    name: "講習会情報",
    link: "seminar",
    order: 5,
    role: 4,
  },
];

const news: newsType[] = [
  {
    title: "すさきオープンウオーター2025",
    detail: "2次要項等関係文書をアップしました。",
    image: null,
    fromDate: new Date("2025/10/4"),
    toDate: new Date("2026/10/4"),
    link: 1,
    createdAt: new Date("2025/10/4"),
    revisedAt: new Date("2025/10/4"),
    approvedAt: new Date("2025/10/4"),
  },
  {
    title: "基礎水泳指導員研修会",
    detail:
      "令和７年度 水泳コーチ１・２ 基礎水泳指導員四国ブロック更新研修会が行われます。",
    image: null,
    fromDate: new Date("2025/9/21"),
    toDate: new Date("2026/9/21"),
    link: 5,
    createdAt: new Date("2025/9/21"),
    revisedAt: new Date("2025/9/21"),
    approvedAt: new Date("2025/9/21"),
  },
  {
    title: "高知県学年別水泳競技大会",
    detail: "結果をアップしました。",
    image: null,
    fromDate: new Date("2025/9/16"),
    toDate: new Date("2026/9/16"),
    link: 1,
    createdAt: new Date("2025/9/16"),
    revisedAt: new Date("2025/9/16"),
    approvedAt: new Date("2025/9/16"),
  },
  {
    title: "学年別水泳競技大会",
    detail:
      "年鑑水泳高知の第10回高知県学年別水泳競技大会の要項に誤りがあり、表彰の基準日を令和7年4月1日から令和8年4月1日に訂正しました。",
    image: null,
    fromDate: new Date("2025/9/11"),
    toDate: new Date("2026/9/11"),
    link: 1,
    createdAt: new Date("2025/9/11"),
    revisedAt: new Date("2025/9/11"),
    approvedAt: new Date("2025/9/11"),
  },
  {
    title: "県学童",
    detail: "優秀選手についてお詫びと訂正文をアップしました。",
    image: null,
    fromDate: new Date("2025/9/5"),
    toDate: new Date("2026/9/5"),
    link: 1,
    createdAt: new Date("2025/9/5"),
    revisedAt: new Date("2025/9/5"),
    approvedAt: new Date("2025/9/5"),
  },
  {
    title: "学年別水泳競技大会",
    detail: "2次要項等関係文書をアップしました。",
    image: null,
    fromDate: new Date("2025/9/4"),
    toDate: new Date("2026/9/4"),
    link: 1,
    createdAt: new Date("2025/9/4"),
    revisedAt: new Date("2025/9/4"),
    approvedAt: new Date("2025/9/4"),
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

      for (let i = 0; i < news.length; i++) {
        await prisma.news.create({
          data: {
            title: news[i].title,
            detail: news[i].detail,
            image: null,
            fromDate: news[i].fromDate,
            toDate: news[i].toDate,
            link: news[i].link,
            order: i + 1,
            createdAt: news[i].createdAt,
            revisedAt: news[i].revisedAt,
            approvedAt: news[i].approvedAt,
            createdUserId: administrator.id,
            revisedUserId: administrator.id,
            approvedUserId: administrator.id,
            approved: true,
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
