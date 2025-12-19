import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname.includes("dashboard")) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.nextUrl.pathname.includes("news_list_3")) {
    const res = await get("news_list_3");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("news_list_top")) {
    const res = await get("news_list_top");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("news_list_num")) {
    const res = await get("news_list_num");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("live_top")) {
    const res = await get("live_top");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("live_active_url")) {
    const res = await get("live_active_url");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("live_list_num")) {
    const res = await get("live_list_num");
    return NextResponse.json(res);
  }

  const regexMeet = /meet_\d{4}_\d/g;
  const urlMeet = req.nextUrl.pathname.match(regexMeet);
  if (urlMeet !== null) {
    const res = await get(`${urlMeet[0]}`);
    return NextResponse.json(res);
  }

  const regexSeminar = /seminar_\d{4}/g;
  const urlSeminar = req.nextUrl.pathname.match(regexSeminar);
  if (urlSeminar !== null) {
    const res = await get(`${urlSeminar[0]}`);
    return NextResponse.json(res);
  }

  const regexRecord = /record_\d_\d_\d/g;
  const urlRecord = req.nextUrl.pathname.match(regexRecord);
  if (urlRecord !== null) {
    const res = await get(`${urlRecord[0]}`);
    return NextResponse.json(res);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/news_list_3",
    "/news_list_top",
    "/news_list_num",
    "/meet_\d{4}_\d",
    "/seminar_\d{4}",
    "/record_\d_\d_\d",
    "/live_top",
    "/live_active_url",
    "/live_list_num",
  ],
};
