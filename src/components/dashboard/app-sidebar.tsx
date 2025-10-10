"use client";

import * as React from "react";

import {
  MessageCircleQuestion,
  UserRoundCog,
  Users,
  Megaphone,
  Trophy,
  Video,
  Timer,
  CalendarCheck2,
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

// This is sample data.
const data = {
  navMain: [
    {
      name: "ユーザー管理",
      link: "user",
      order: 0,
      role: 2,
      icon: Users,
    },
    {
      name: "お知らせ",
      link: "news",
      order: 1,
      role: 4,
      icon: Megaphone,
    },
    {
      name: "競技会情報",
      link: "meet",
      order: 2,
      role: 4,
      icon: Trophy,
    },
    {
      name: "ライブ配信",
      link: "live",
      order: 3,
      role: 4,
      icon: Video,
    },
    {
      name: "県記録",
      link: "record",
      order: 4,
      role: 4,
      icon: Timer,
    },
    {
      name: "講習会情報",
      link: "seminar",
      order: 5,
      role: 4,
      icon: CalendarCheck2,
    },
  ],
  navSecondary: [
    {
      title: "アカウント設定",
      url: "#",
      icon: UserRoundCog,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
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
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
