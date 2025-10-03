// お問い合わせメッセージの送信
import { ClientConfig, messagingApi } from "@line/bot-sdk";
import { NextResponse } from "next/server";
import { getList } from "@/lib/contact/actions";
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.NEXT_PUBLIC_AUTH_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.NEXT_PUBLIC_AUTH_CHANNEL_SECRET || "",
};

const client = new messagingApi.MessagingApiClient(clientConfig);

export function GET() {
  return NextResponse.json({ method: "GET" });
}

export async function POST(request: Request) {
  const req = await request.json();
  console.log(req);
  try {
    const admins = await getList();
    console.log(admins);
    await Promise.all(
      admins.map(async (admin) => {
        await client.pushMessage({
          to: admin.providerAccountId,
          messages: [
            {
              type: "text",
              text: `${admin.user.name}様、いつもお世話になっております。`,
            },
            {
              type: "text",
              text: "高知県水泳連盟公式ウェブページに以下のお問い合わせがありました。",
            },
            {
              type: "text",
              text: `姓名: ${req.data.lastName} ${req.data.firstName}\n所属: ${req.data.affiliation}\nEmail: ${req.data.email}\n電話番号: ${req.data.phone}\n本文: ${req.data.message}`,
            },
            {
              type: "text",
              text: "お忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。",
            },
          ],
        });
      })
    );
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json({
    method: "POST",
  });
}
