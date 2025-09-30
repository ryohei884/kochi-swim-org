import { type LineProfile } from "@auth/core/providers/line";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import LINE from "next-auth/providers/line";

import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    LINE({
      profile(profile: LineProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.emailVerified,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
      clientId: process.env.NEXT_PUBLIC_AUTH_LINE_ID,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_LINE_SECRET,
      checks: ["state"],
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    // jwt({ token, user }) {
    //   if (user) token.role = user.role;
    //   return token;
    // },
    // session({ session, token }) {
    //   session.user.role = token.role;
    //   return session;
    // },
  },
});
