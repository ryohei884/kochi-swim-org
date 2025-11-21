"use client";

import type { DefaultSession } from "@auth/core/types";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  items: {
    name: string;
    link: string;
    order: number;
    icon: LucideIcon;
    only: string[];
  }[];
  permission: Permission;
};

export function NavMain(props: Props) {
  const { session, items, permission } = props;
  return (
    <SidebarMenu className="pt-4">
      {items
        .sort((a, b) => a.order - b.order)
        .map((item) => {
          if (!session || !session.user.role) {
            return null;
          }

          if (item.only.length > 0 && !item.only.includes(session.user.role)) {
            return null;
          }

          if (
            permission.filter(
              (v) => v.categoryLink === item.link && v.view === true,
            ).length === 0 &&
            session.user.role !== "administrator"
          ) {
            return null;
          }

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={`/dashboard/${item.link}`} replace>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
    </SidebarMenu>
  );
}
