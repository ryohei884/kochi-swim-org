"use client";

import type { DefaultSession } from "@auth/core/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, Copy, Lock } from "lucide-react";
import { useEffect, useState } from "react";

import ApproveForm from "@/components/dashboard/news/approve-form";
import CreateForm from "@/components/dashboard/news/create-form";
import ExcludeForm from "@/components/dashboard/news/exclude-form";
import ReOrder from "@/components/dashboard/news/reorder";
import UpdateForm from "@/components/dashboard/news/update-form";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getListAdmin, getListNumAdmin } from "@/lib/news/actions";
import type { newsWithUserSchemaType } from "@/lib/news/verification";
import { copyToClipboard, newsLinkCategory } from "@/lib/utils";

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

type Approver = {
  userId: string;
  userDisplayName: string | null;
  userName: string | null;
}[];

type Props = {
  session: Session | null;
  permission: Permission;
  page: number;
  approver: Approver;
};

export default function NewsList(props: Props) {
  const { page, session, permission, approver } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [data, setData] = useState<newsWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  const [maxOrder, setMaxOrder] = useState<number>(0);
  // const [session, setSsn] = useState<Session | null>(null);
  const pms: Permission = permission.filter((v) => v.categoryLink === "news");

  const fetchListData = async (id?: string) => {
    data && setCallbackData(id);
    const res = await getListAdmin(page);
    if (res !== null) {
      setData(res);
      const newsNum = await getListNumAdmin();
      setDataNum(newsNum);
      const orders = res.map((value) => value.order);
      setMaxOrder(Math.max(...orders) + 1);
      setIsReady(true);
    } else {
      setData(res);
      setDataNum(0);
      setMaxOrder(1);
      setIsReady(true);
    }
  };

  useEffect(() => {
    setIsReady(false);
    fetchListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isReady) {
    if (!session || !session.user.role) {
      return null;
    }

    if (
      pms.filter((v) => v.view === true).length === 0 &&
      session.user.role !== "administrator"
    ) {
      return null;
    }
  }

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        お知らせ{" "}
        {isReady &&
          (pms.filter((v) => v.submit === true).length > 0 ||
            session?.user.role === "administrator") && (
            <CreateForm
              fetchListData={fetchListData}
              maxOrder={maxOrder}
              approver={approver}
            />
          )}
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>表示順</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>本文</TableHead>
            <TableHead>リンク</TableHead>
            <TableHead>掲載期間</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>最終更新日</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>更新者</TableHead>
            <TableHead>承認者</TableHead>
            <TableHead className="text-center">変更</TableHead>
            <TableHead className="text-center">削除</TableHead>
            <TableHead className="text-center">承認</TableHead>
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
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                      </TableCell>
                      <TableCell className="flex-none text-center w-12">
                        <Button variant="ghost">
                          <Skeleton className="size-6 border border-input file:border-0" />
                        </Button>
                      </TableCell>
                      <TableCell className="flex-none text-center w-12">
                        <Button variant="ghost">
                          <Skeleton className="size-6 border border-input file:border-0" />
                        </Button>
                      </TableCell>
                      <TableCell className="flex-none text-center w-12">
                        <Button variant="ghost">
                          <Skeleton className="size-6 border border-input file:border-0" />
                        </Button>
                      </TableCell>
                    </TableRow>,
                  );
                }
                return <>{rows}</>;
              })()
            : data.map((d) => {
                return (
                  <TableRow
                    key={d.id}
                    className={callbackData === d.id ? "bg-muted" : ""}
                  >
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => copyToClipboard(d.id)}
                          >
                            <Copy className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>コピー</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{d.order}</TableCell>
                    <TableCell>
                      {d.title.substring(0, 10)}
                      {d.title.length > 10 && "..."}
                    </TableCell>
                    <TableCell>
                      {d.detail.substring(0, 10)}
                      {d.detail.length > 10 && "..."}
                    </TableCell>
                    <TableCell>
                      {
                        newsLinkCategory.find((v) => v.id === d.linkCategory)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {d.fromDate && format(d.fromDate, "PPP", { locale: ja })}{" "}
                      〜 {d.toDate && format(d.toDate, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {format(d.createdAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {format(d.revisedAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {d.createdUser.displayName || d.createdUser.name}
                    </TableCell>
                    <TableCell>
                      {d.revisedUser?.displayName || d.revisedUser?.name}
                    </TableCell>
                    <TableCell>
                      {d.approvedUser?.displayName || d.approvedUser?.name}
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      {pms.filter((v) => v.revise === true).length === 0 &&
                      /* ||
                        (d.approved === true &&
                          d.createdUserId !== session?.user.id &&
                          d.revisedUserId !== session?.user.id) */ session?.user
                        .role !== "administrator" ? (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="size-4" />
                        </Button>
                      ) : (
                        <UpdateForm
                          key={d.id}
                          id={d.id}
                          fetchListData={fetchListData}
                          approver={approver}
                        />
                      )}
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      {pms.filter((v) => v.exclude === true).length === 0 /* ||
                        d.createdUserId !== session?.user.id */ &&
                      session?.user.role !== "administrator" ? (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="size-4" />
                        </Button>
                      ) : (
                        <ExcludeForm
                          key={d.id}
                          id={d.id}
                          fetchListData={fetchListData}
                        />
                      )}
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      {d.approved ? (
                        <Button variant="ghost" size="sm" disabled>
                          <CheckIcon className="size-4" />
                        </Button>
                      ) : pms.filter((v) => v.approve === true).length ===
                          0 /*||
                          d.approvedUserId !== session?.user.id */ &&
                        session?.user.role !== "administrator" ? (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="size-4" />
                        </Button>
                      ) : (
                        <ApproveForm
                          key={d.id}
                          id={d.id}
                          fetchListData={fetchListData}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <hr />
      <div className="text-right">
        <ReOrder fetchListData={fetchListData} />
      </div>
      <Pagination className="mt-16 flex items-center justify-between">
        <PaginationContent className="-mt-px flex w-0 flex-1">
          <PaginationItem className="inline-flex items-center">
            <PaginationPrevious
              href={`/dashboard/news/${previousPage}`}
              hidden={previousPage < 1}
            />
          </PaginationItem>
          <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
            <PaginationNext
              href={`/dashboard/news/${nextPage}`}
              className="inline-flex items-center"
              hidden={dataNum <= Number(page) * 10}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
