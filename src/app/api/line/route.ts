// お問い合わせメッセージの送信
import { NextResponse } from "next/server";

import { contactEmail } from "@/app/api/line/email";
import { contactLine } from "@/app/api/line/line";
import { getList } from "@/lib/contact/actions";

export function GET() {
  return NextResponse.json({ method: "GET" });
}

export async function POST(request: Request) {
  const req = await request.json();
  console.log(req);
  try {
    const admins = await getList();
    await Promise.all(
      admins.map(async (admin) => {
        if (admin.user.emailVerified !== null) {
          const email = await contactEmail({
            to: admin.user.email,
            subject: "お問い合わせ受付",
            text: `${admin.user.name}様\n\nいつもお世話になっております。\n\n高知県水泳連盟公式ウェブページに以下のお問い合わせがありました。\n\n姓名: ${req.data.lastName} ${req.data.firstName}\n所属: ${req.data.affiliation}\nEmail: ${req.data.email}\n電話番号: ${req.data.phone}\n本文: ${req.data.message}\n\nお忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。`,
            html: `<b>${admin.user.name}様</b><br /><p>いつもお世話になっております。</p><br /><p>高知県水泳連盟公式ウェブページに以下のお問い合わせがありました。</p><br /><p>姓名: ${req.data.lastName} ${req.data.firstName}<br />所属: ${req.data.affiliation}<br />Email: ${req.data.email}<br />電話番号: ${req.data.phone}<br />本文: ${req.data.message}</p><br /><p>お忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。</p>`,
          });
        }

        const line = await contactLine({
          to: admin.providerAccountId,
          name: admin.user.name || "管理者",
          lastName: req.data.lastName,
          firstName: req.data.firstName,
          affiliation: req.data.affiliation,
          email: req.data.email,
          phone: req.data.phone,
          message: req.data.message,
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
