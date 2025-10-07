// PING
import { ClientConfig, messagingApi } from "@line/bot-sdk";
import { NextResponse } from "next/server";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET || "",
};

const client = new messagingApi.MessagingApiClient(clientConfig);

export function GET() {
  return NextResponse.json({ method: "GET" });
}

export async function POST(request: Request) {
  const req = await request.json();

  await Promise.all(
    (req.events || []).map((event: typeof req.events) =>
      (async () => {
        switch (event.type) {
          case "message": {
            return client.replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: "text",
                  text: event.message,
                },
              ],
            });
          }
        }
      })()
    )
  );

  return NextResponse.json({ method: "POST" });
}
