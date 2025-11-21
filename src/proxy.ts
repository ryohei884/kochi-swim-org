import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname.includes("dashboard")) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.nextUrl.pathname.includes("welcome")) {
    const greeting = await get("greeting");
    return NextResponse.json(greeting);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/welcome"],
};
