"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, ExternalLink, Lock, Copy } from "lucide-react";
import Link from "next/link";

import type { meetWithUserSchemaType } from "@/lib/meet/verification";

import ApproveForm from "@/components/dashboard/meet/approve-form";
import CreateForm from "@/components/dashboard/meet/create-form";
import ExcludeForm from "@/components/dashboard/meet/exclude-form";
import UpdateForm from "@/components/dashboard/meet/update-form";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getListPageAdmin,
  getByIdAdmin,
  getListAdmin,
  getListNumAdmin,
} from "@/lib/meet/actions";
import { meetKind, poolSize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { DefaultSession } from "@auth/core/types";

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

interface Props {
  kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  year: number;
  page: number;
  session: Session | null;
  permission: Permission;
  approver: Approver;
}

export default function MeetList(props: Props) {
  const router = useRouter();
  const { kind, year, page, session, permission, approver } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [data, setData] = useState<meetWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const pms: Permission = permission.filter((v) => v.categoryLink === "meet");

  const fetchData = async (
    kind: string,
    year: number,
    page: number,
    id?: string,
  ) => {
    data && setCallbackData(id);
    const kindNum = meetKind.find((v) => v.href === kind)?.id || 0;
    const res = await getListAdmin(kindNum, year, page);

    if (res !== null) {
      const meetNum = await getListNumAdmin(kindNum, year);
      setData(res);
      setDataNum(meetNum);
      setIsReady(true);
    }
  };

  const fetchListData = async (id?: string) => {
    // data && setCallbackData(id);
    if (id !== undefined) {
      const resMeet = await getByIdAdmin({ id: id });
      const resPage = await getListPageAdmin(id);
      if (resMeet !== null) {
        const resList = await getListAdmin(
          resMeet.kind,
          resMeet.fromDate.getFullYear(),
          Math.round(resPage > 0 ? Math.floor((resPage - 1) / 10) + 1 : 1),
        );
        if (resList !== null) {
          const kindHref = meetKind.find((v) => v.id === resMeet.kind)?.href;
          const meetNum = await getListNumAdmin(
            resMeet.kind,
            resMeet.fromDate.getFullYear(),
          );
          setData(resList);
          setDataNum(meetNum);
          setCallbackData(id);
          router.push(
            `/dashboard/meet/${kindHref}/${resMeet.fromDate.getFullYear()}/${Math.round(
              resPage > 0 ? Math.floor((resPage - 1) / 10) + 1 : 1,
            )}`,
          );
          setIsReady(true);
        }
      }
    } else {
      const kindNum = meetKind.find((v) => v.href === kind)?.id || 0;
      const resList = await getListAdmin(kindNum, year, page);
      if (resList !== null) {
        const meetNum = await getListNumAdmin(kindNum, year);
        setData(resList);
        setDataNum(meetNum);
        setCallbackData(undefined);
        // router.push(`/dashboard/meet/${kind}/${year}/${page}`);
        setIsReady(true);
      }
    }
  };

  const handleChange = (e: string) => {
    router.push(`/dashboard/meet/${e}/1`);
    setIsReady(false);
  };

  useEffect(() => {
    setIsReady(false);
    fetchData(kind, year, page, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, year, page]);

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

  const copyToClipboard = async (meetId: string) => {
    await global.navigator.clipboard.writeText(meetId);
  };

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        競技会情報{" "}
        {isReady &&
          (pms.filter((v) => v.submit === true).length > 0 ||
            session?.user.role === "administrator") && (
            <CreateForm fetchListData={fetchListData} approver={approver} />
          )}
      </h4>
      <Tabs
        defaultValue={`${kind}/${year}`}
        onValueChange={(e) => handleChange(e)}
      >
        <TabsList>
          <TabsTrigger value={`swimming/${year}`}>競泳</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`diving/${year}`}>飛込</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`waterpolo/${year}`}>水球</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`as/${year}`}>AS</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`ow/${year}`}>OW</TabsTrigger>
        </TabsList>
        <Tabs
          defaultValue={`${kind}/${year}`}
          onValueChange={(e) => handleChange(e)}
        >
          <TabsList>
            <TabsTrigger value={`${kind}/2025`}>2025</TabsTrigger>
            <Separator orientation="vertical" />
            <TabsTrigger value={`${kind}/2026`}>2026</TabsTrigger>
          </TabsList>
          <TabsContent value={`${kind}/${year}`}>
            <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
              {meetKind.find((v) => v.href === kind)?.kind}
            </p>
            <hr />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  {kind === "swimming" && <TableHead>大会コード</TableHead>}
                  <TableHead>大会名</TableHead>
                  <TableHead>開催期間</TableHead>
                  <TableHead>会場</TableHead>
                  <TableHead>水路</TableHead>
                  <TableHead>要項</TableHead>
                  <TableHead>追加資料</TableHead>
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
                            {kind === "swimming" && (
                              <TableCell>
                                <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                              </TableCell>
                            )}
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
                          {kind === "swimming" && (
                            <TableCell className="flex items-center-safe">
                              {d.code && (
                                <Button variant="link" className="pl-0">
                                  <Link
                                    href={`https://result.swim.or.jp/tournament/${d.code}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="flex  items-center-safe"
                                  >
                                    {d.code}
                                    <ExternalLink className="size-4 ml-2" />
                                  </Link>
                                </Button>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {d.title.substring(0, 10)}
                            {d.title.length > 10 && "..."}
                          </TableCell>
                          <TableCell>
                            {d.fromDate &&
                              format(d.fromDate, "PPP", { locale: ja })}
                            {d.toDate &&
                              `〜 ${format(d.toDate, "PPP", { locale: ja })}`}
                          </TableCell>
                          <TableCell>{d.place}</TableCell>
                          <TableCell>
                            {poolSize.find((v) => v.id === d.poolsize)?.size}
                          </TableCell>
                          <TableCell>
                            {d.detail && d.detail !== "[]" && (
                              <CheckIcon className="size-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            {d.attachment && d.attachment !== "[]" && (
                              <CheckIcon className="size-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            {d.createdUser.displayName || d.createdUser.name}
                          </TableCell>
                          <TableCell>
                            {d.revisedUser?.displayName || d.revisedUser?.name}
                          </TableCell>
                          <TableCell>
                            {d.approvedUser?.displayName ||
                              d.approvedUser?.name}
                          </TableCell>
                          <TableCell className="flex-none text-center w-12">
                            {(pms.filter((v) => v.revise === true).length ===
                              0 ||
                              (d.approved === true &&
                                d.createdUserId !== session?.user.id &&
                                d.revisedUserId !== session?.user.id)) &&
                            session?.user.role !== "administrator" ? (
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
                            {(pms.filter((v) => v.exclude === true).length ===
                              0 ||
                              d.createdUserId !== session?.user.id) &&
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
                            ) : (pms.filter((v) => v.approve === true)
                                .length === 0 ||
                                d.approvedUserId !== session?.user.id) &&
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
            <Pagination className="mt-16 flex items-center justify-between">
              <PaginationContent className="-mt-px flex w-0 flex-1">
                <PaginationItem className="inline-flex items-center">
                  <PaginationPrevious
                    href={`/dashboard/meet/${kind}/${year}/${previousPage}`}
                    hidden={previousPage < 1}
                  />
                </PaginationItem>
                <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                  <PaginationNext
                    href={`/dashboard/meet/${kind}/${year}/${nextPage}`}
                    className="inline-flex items-center"
                    hidden={dataNum <= Number(page) * 10}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
        </Tabs>
      </Tabs>
    </>
  );
}
