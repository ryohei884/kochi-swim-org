"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    link: string;
    order: number;
    icon: LucideIcon;
  }[];
}) {
  return (
    <SidebarMenu className="pt-4">
      {items
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/${item.link}`} replace>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
