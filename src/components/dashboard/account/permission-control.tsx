"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SquareCheck, Minus } from "lucide-react";

// import type { DefaultSession } from "@auth/core/types";

// interface Session {
//   user: {
//     role: "administrator" | "user";
//   } & DefaultSession["user"];
// }

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
  permission: Permission;
};

export default function PC(props: Props) {
  const { permission } = props;
  const isReady = true;
  const dataNum = permission.length;
  const data = permission;

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        権限一覧{" "}
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>カテゴリ名</TableHead>
            <TableHead>閲覧</TableHead>
            <TableHead>作成</TableHead>
            <TableHead>修正</TableHead>
            <TableHead>削除</TableHead>
            <TableHead>承認</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isReady
            ? (function () {
                const rows = [];
                for (let i = 0; i < dataNum; i++) {
                  rows.push(
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      {(function () {
                        const cols = [];
                        for (let j = 0; j < 5; j++) {
                          cols.push(
                            <TableCell key={`${i}_${j}`}>
                              <Button variant="ghost">
                                <Skeleton className="size-6 border border-input file:border-0" />
                              </Button>
                            </TableCell>,
                          );
                        }
                        return <>{cols}</>;
                      })()}
                    </TableRow>,
                  );
                }
                return <>{rows}</>;
              })()
            : data.map((d) => {
                return (
                  <TableRow key={d.categoryId}>
                    <TableCell>{d.categoryName}</TableCell>
                    <TableCell>
                      {d.view ? (
                        <Button variant="ghost" size="sm">
                          <SquareCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Minus className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {d.submit ? (
                        <Button variant="ghost" size="sm">
                          <SquareCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Minus className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {d.revise ? (
                        <Button variant="ghost" size="sm">
                          <SquareCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Minus className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {d.exclude ? (
                        <Button variant="ghost" size="sm">
                          <SquareCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Minus className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {d.approve ? (
                        <Button variant="ghost" size="sm">
                          <SquareCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Minus className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <hr />
    </>
  );
}
