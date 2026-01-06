// お問い合わせメッセージの送信
import { NextResponse } from "next/server";

import { advertisingSponsorshipEmail } from "@/app/api/advertising-sponsorship/email";
const contactAddress = process.env.EMAIL_SPONSORSHIP_RECIPIENT?.replaceAll(
  " ",
  "　",
).split(";");

export function GET() {
  return NextResponse.json({ method: "GET" });
}

export async function POST(request: Request) {
  const req = await request.json();
  console.log(req);
  // const plansTyped: { label: string; value: string }[] = plans;
  // const submitTyped: { label: string; value: string }[] = submit;
  // const advertisementSize = plansTyped.find(
  //   (v) => v.value === req.data.advertisementSize,
  // )?.label;
  // const howtoSendYourManuscript: string | undefined = submitTyped.find(
  //   (v) => v.value === req.data.howtoSendYourManuscript,
  // )?.label;

  try {
    await Promise.all([
      contactAddress !== undefined &&
        contactAddress.map(async (email_address) => {
          if (email_address !== null) {
            const email = await advertisingSponsorshipEmail({
              to: email_address,
              subject: "広告掲載申込受付",
              text: `高知県水泳連盟公式ウェブページを通じて、広告掲載の申し込みがありました。\n\nプラン: ${req.data.advertisementSize}\n法人・事業所名: ${req.data.companyName}\nご担当者名: ${req.data.contactName}\n郵便番号: ${req.data.postalCode}\n住所: ${req.data.address}\n電話番号: ${req.data.telephone}\nFAX番号: ${req.data.fax}\nEメールアドレス: ${req.data.email}\n本連盟担当者名: ${req.data.fedContactPerson}\n原稿送付方法: ${req.data.howtoSendYourManuscript}\n\nお忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。`,
              html: `<p>高知県水泳連盟公式ウェブページを通じて、広告掲載の申し込みがありました。</p><br /><p>プラン: ${req.data.advertisementSize}<br />法人・事業所名: ${req.data.companyName}<br />ご担当者名: ${req.data.contactName}<br />郵便番号: ${req.data.postalCode}<br />住所: ${req.data.address}<br />電話番号: ${req.data.telephone}<br />FAX番号: ${req.data.fax}<br />Eメールアドレス: ${req.data.email}<br />本連盟担当者名: ${req.data.fedContactPerson}<br />原稿送付方法: ${req.data.howtoSendYourManuscript}</p><br /><p>お忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。</p>`,
            });
          }
        }),
    ]);
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json({
    method: "POST",
  });
}
