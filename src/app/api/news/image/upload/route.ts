import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) throw new Error("No filename.");
  if (!request.body) throw new Error("No request.body.");

  const img = await new Response(request.body).text();
  const data = img.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  const file = new File([buf], `${filename}`, {
    type: "image/png",
  });

  const blob = await put(`${filename}`, file, {
    access: "public",
    contentType: "image/png",
  });

  return NextResponse.json(blob);
}
