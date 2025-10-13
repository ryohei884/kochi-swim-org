import { PrismaClient } from "@/app/generated/prisma/edge";
import { newsSchemaType } from "@/lib/news/verification";
const prisma = new PrismaClient();

type userType = {
  name: string;
  displayName: string;
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
  linkCategory: number | null;
  linkString: string | null;
  createdAt: Date;
  revisedAt: Date;
  approvedAt: Date;
};

const user: userType[] = [
  {
    name: "管理者",
    displayName: "管理者",
    email: process.env.PRISMA_ADMINISTRATOR_EMAIL,
    emailVerified: null,
    image: null,
    role: "administrator",
  },
  {
    name: "承認者",
    displayName: "承認者",
    email: process.env.PRISMA_APPROVER_EMAIL,
    emailVerified: null,
    image: null,
    role: "approver",
  },
  {
    name: "編集者",
    displayName: "編集者",
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

type meetType = {
  kind: number;
  title: string;
  fromDate: Date;
  toDate: Date | null;
  place: string;
  poolsize: number;
  result: boolean;
  description: string;
  detail: string;
  attachment: string;
  createdUserId: string;
  approvedUserId: string;
  approved: boolean;
};

const meet = [
  {
    kind: 1,
    fromDate: "2025/04/27",
    toDate: null,
    title: "第62回 高知県春季水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/05/10",
    toDate: "2025/05/11",
    title: "四国スイミングクラブ対抗水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/06/01",
    toDate: null,
    title: "日本マスターズ水泳短水路大会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/06/07",
    toDate: "2025/06/08",
    title: "第78回 高知県高等学校体育大会水泳競技(競泳の部）",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/06/22",
    toDate: null,
    title: "高知県ＳＣ選手権水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/07/06",
    toDate: null,
    title: "第48回全国JOC夏季水泳競技大会高知県予選会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/07/19",
    toDate: "2025/07/20",
    title: "第76回四国高等学校選手権水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/07/22",
    toDate: "2025/07/23",
    title: "高知県中学校水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/07/26",
    toDate: "2025/07/27",
    title: "高知県選手権水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/08/03",
    toDate: null,
    title: "第63回四国中学校総合体育大会水泳競技大会",
    place: "香川県立",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/08/03",
    toDate: null,
    title: "第46回高知県学童水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/08/06",
    toDate: "2025/08/08",
    title: "第72回全国国公立選手権水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/08/30",
    toDate: "2025/08/31",
    title: "第54回四国学童選手権水泳競技大会",
    place: "むつみスイミング",
    poolsize: "2",
  },
  {
    kind: 1,
    fromDate: "2025/09/07",
    toDate: null,
    title: "水泳の日2025",
    place: "春野",
    poolsize: "0",
  },
  {
    kind: 1,
    fromDate: "2025/09/14",
    toDate: "2025/09/14",
    title: "第10回高知県学年別水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/11/16",
    toDate: null,
    title: "高知県ＳＣ対抗水泳競技大会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2025/11/30",
    toDate: null,
    title: "高知県ＳＣ協会 ＢＣ級大会 兼 冬季ジュニア記録会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2026/01/10",
    toDate: null,
    title: "SC新年フェスティバル",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2026/02/08",
    toDate: null,
    title: "高知県春季Jr水泳競技大会 兼 第48回JOC予選会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2026/02/15",
    toDate: null,
    title: "高知県ＳＣ協会 記録会",
    place: "くろしおアリーナ",
    poolsize: "1",
  },
  {
    kind: 1,
    fromDate: "2026/03/15",
    toDate: null,
    title: "第2回高知県水泳記録会四万十市大会",
    place: "安並",
    poolsize: "1",
  },
];

const news: newsType[] = [
  {
    title: "すさきオープンウオーター2025",
    detail: "2次要項等関係文書をアップしました。",
    image: null,
    fromDate: new Date("2025/10/4"),
    toDate: new Date("2026/10/4"),
    linkCategory: 1,
    linkString: null,
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
    linkCategory: 5,
    linkString: null,
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
    linkCategory: 1,
    linkString: null,
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
    linkCategory: 1,
    linkString: null,
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
    linkCategory: 1,
    linkString: null,
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
    linkCategory: 1,
    linkString: null,
    createdAt: new Date("2025/9/4"),
    revisedAt: new Date("2025/9/4"),
    approvedAt: new Date("2025/9/4"),
  },
];

async function main() {
  // await prisma.$transaction(async (prisma) => {
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
  // });

  await prisma.$transaction(async (prisma) => {
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
            linkCategory: news[i].linkCategory,
            linkString: null,
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

      for (let i = 0; i < meet.length; i++) {
        await prisma.meet.create({
          data: {
            kind: meet[i].kind,
            title: meet[i].title,
            fromDate: new Date(meet[i].fromDate),
            toDate:
              meet[i].toDate !== null ? new Date(String(meet[i].toDate)) : null,
            place: meet[i].place,
            poolsize: Number(meet[i].poolsize),
            result: false,
            description: "",
            detail: null,
            attachment: null,
            createdUserId: administrator.id,
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
