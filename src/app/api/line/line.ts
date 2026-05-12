import { HTTPFetchError, LineBotClient } from "@line/bot-sdk";

// const clientConfig: LineBotClientChannelAccessTokenConfig = {
//   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
//   channelSecret: process.env.CHANNEL_SECRET || "",
// };

// const client = new messagingApi.MessagingApiClient(clientConfig);
const client = LineBotClient.fromChannelAccessToken({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
});

interface Props {
  to: string;
  name: string;
  lastName: string;
  firstName: string;
  affiliation: string;
  email: string;
  phone: string;
  message: string;
}

export const contactLine = async (props: Props) => {
  const { to, name, lastName, firstName, affiliation, email, phone, message } =
    props;

  try {
    await client.pushMessage({
      to: to,
      messages: [
        {
          type: "text",
          text: `${name}様、いつもお世話になっております。`,
        },
        {
          type: "text",
          text: "高知県水泳連盟公式ウェブページに以下のお問い合わせがありました。",
        },
        {
          type: "text",
          text: `姓名: ${lastName} ${firstName}\n所属: ${affiliation}\nEmail: ${email}\n電話番号: ${phone}\n本文: ${message}`,
        },
        {
          type: "text",
          text: "お忙しいところ恐縮ではございますが、速やかにご対応いただけますと幸いです。",
        },
      ],
    });
  } catch (err) {
    if (err instanceof HTTPFetchError) {
      console.error(err.status);
      console.error(err.headers.get("x-line-request-id"));
      console.error(err.body); // raw string — JSON.parse() if needed
    }
  }
};
