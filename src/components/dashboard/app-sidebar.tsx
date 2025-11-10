"use client";

import * as React from "react";

import {
  UserRoundCog,
  Users,
  Megaphone,
  Trophy,
  Video,
  Timer,
  CalendarCheck2,
  MessageSquare,
  Component,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { DefaultSession } from "@auth/core/types";

// This is sample data.
const data = {
  navMain: [
    {
      name: "カテゴリ管理",
      link: "category",
      order: 0,
      role: 2,
      icon: Component,
      only: ["administrator"],
    },
    {
      name: "グループ権限管理",
      link: "group",
      order: 0,
      role: 2,
      icon: Users,
      only: ["administrator"],
    },
    {
      name: "お知らせ",
      link: "news",
      order: 1,
      role: 4,
      icon: Megaphone,
      only: [],
    },
    {
      name: "競技会情報",
      link: "meet",
      order: 2,
      role: 4,
      icon: Trophy,
      only: [],
    },
    {
      name: "ライブ配信",
      link: "live",
      order: 3,
      role: 4,
      icon: Video,
      only: [],
    },
    {
      name: "県記録",
      link: "record",
      order: 4,
      role: 4,
      icon: Timer,
      only: [],
    },
    {
      name: "講習会情報",
      link: "seminar",
      order: 5,
      role: 4,
      icon: CalendarCheck2,
      only: [],
    },
  ],
  navSecondary: [
    {
      title: "アカウント設定",
      url: "account",
      icon: UserRoundCog,
    },
    {
      title: "お問い合わせ",
      url: "../contact",
      icon: MessageSquare,
    },
    {
      title: "サインアウト",
      url: "sign-out",
      icon: LogOut,
    },
  ],
};

interface Session {
  user: {
    role: "administrator" | "user";
  } & DefaultSession["user"];
}

type Permission = {
  categoryId: string;
  categoryName: string;
  categoryLink: string;
  view: boolean;
  submit: boolean;
  revise: boolean;
  exclude: boolean;
  approve: boolean;
}[];

type Props = {
  session: Session | null;
  permission: Permission;
};

export function AppSidebar(props: Props) {
  const { session, permission } = props;

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader>
        <Link href="/" className="-m-1.5 p-1.5 inline-flex" replace>
          <span className="sr-only">高知県水泳連盟</span>
          <Image
            alt="高知県水泳連盟"
            src="/logo.svg"
            className="h-8 w-auto dark:hidden"
            width={8}
            height={8}
          />
          <Image
            alt="高知県水泳連盟"
            src="/logo.svg"
            className="h-8 w-auto not-dark:hidden"
            width={8}
            height={8}
          />
          <div className="px-4 text-2xl font-bold">高知県水泳連盟</div>
        </Link>
        <NavMain
          items={data.navMain}
          session={session}
          permission={permission}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
