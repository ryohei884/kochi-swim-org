"use client";
import { useState, useEffect, Fragment } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
// import { Play } from "lucide-react";

// import type { liveWithUserSchemaType } from "@/lib/live/verification";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { getList, getListNum } from "@/lib/live/actions";
// import { poolSize } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const category = [
  { categoryId: 1, categoryName: "水泳連盟", order: 1 },
  { categoryId: 2, categoryName: "関連協会", order: 2 },
  { categoryId: 3, categoryName: "その他", order: 3 },
];
const link = [
  {
    categoryId: 1,
    title: "日本水泳連盟",
    href: "https://aquatics.or.jp/",
    order: 1,
  },
  {
    categoryId: 2,
    title: "日本スイミングクラブ協会",
    href: "https://www.sc-net.or.jp/",
    order: 2,
  },
  {
    categoryId: 2,
    title: "日本マスターズ水泳協会",
    href: "https://www.masters-swim.or.jp/",
    order: 5,
  },
  {
    categoryId: 2,
    title: "日本スイミングクラブ協会 四国支部",
    href: "https://sc-shikoku.net/",
    order: 3,
  },
  {
    categoryId: 3,
    title: "Results of Japan Swimming",
    href: "https://result.swim.or.jp/",
    order: 9,
  },
  {
    categoryId: 1,
    title: "香川県水泳協会",
    href: "https://kagawa-swim.com/",
    order: 6,
  },
  {
    categoryId: 1,
    title: "愛媛県水泳連盟",
    href: "http://www.esr-jp.com/",
    order: 7,
  },
  {
    categoryId: 1,
    title: "徳島県水泳連盟",
    href: "https://tokushima-swim.jp/",
    order: 8,
  },
  {
    categoryId: 2,
    title: "高知県スイミングクラブ協会",
    href: "https://sc-shikoku.net/kochi/",
    order: 4,
  },
];

export default function LinkList() {
  const linkNum = link.length;

  return (
    <div className="mt-16 lg:mt-20">
      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead>カテゴリ</TableHead>
            <TableHead>リンク</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {category
            .sort((a, b) => a.order - b.order)
            .map((c) => {
              return link
                .filter((v) => v.categoryId === c.categoryId)
                .sort((a, b) => a.order - b.order)
                .map((l) => (
                  <TableRow key={l.title}>
                    {/* <TableCell>{c.categoryName}</TableCell> */}
                    <TableCell className="flex items-center-safe">
                      <Button variant="link">
                        {l.href !== null && (
                          <Link
                            href={`${l.href}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {l.title}
                          </Link>
                        )}
                        <ExternalLink className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ));
            })}
        </TableBody>
      </Table>
      <hr />
    </div>
  );
}
