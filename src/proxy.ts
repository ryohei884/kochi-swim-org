import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname.includes("dashboard")) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.nextUrl.pathname.includes("news_list3")) {
    const res = await get("news_list3");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("news_list_top")) {
    const res = await get("news_list_top");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("news_list_top_num")) {
    const res = await get("news_list_top_num");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("meet_list_top")) {
    const res = await get("meet_list_top");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("meet_list_num")) {
    const res = await get("meet_list_top_num");
    return NextResponse.json(res);
  }

  if (req.nextUrl.pathname.includes("seminar_list_top")) {
    const res = await get("seminar_list_top");
    return NextResponse.json(res);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/news_list3",
    "/news_list_top",
    "/news_list_top_num",
    "/meet_list_top",
    "/meet_list_top_num",
    "/seminar_list_top",
  ],
};
