"use client";

// import ReOrder from "@/components/dashboard/news/reorder";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, ExternalLink } from "lucide-react";
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
  getById,
  getListAdmin,
  getListNumAdmin,
} from "@/lib/meet/actions";
import { meetKind, poolSize } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  year: number;
  page: number;
}

export default function MeetList(props: Props) {
  const router = useRouter();
  const { kind, year, page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [data, setData] = useState<meetWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const fetchData = async (
    kind: string,
    year: number,
    page: number,
    id?: string,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
      const resMeet = await getById({ id: id });
      const resPage = await getListPageAdmin(id);
      if (resMeet !== null) {
        const resList = await getListAdmin(
          resMeet.kind,
          resMeet.fromDate.getFullYear(),
          Math.floor(resPage / 10) + 1,
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
              Math.floor(resPage / 10) + 1,
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

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        競技会情報 <CreateForm fetchListData={fetchListData} />
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
                  <TableHead>大会コード</TableHead>
                  <TableHead>大会名</TableHead>
                  <TableHead>競技種別</TableHead>
                  <TableHead>開催期間</TableHead>
                  <TableHead>会場</TableHead>
                  <TableHead>水路</TableHead>
                  <TableHead>申込締切</TableHead>
                  <TableHead>要項</TableHead>
                  <TableHead>追加資料</TableHead>
                  <TableHead>作成者</TableHead>
                  <TableHead>更新者</TableHead>
                  <TableHead>承認状態</TableHead>
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
                          <TableCell className="flex justify-between">
                            {d.code && d.kind === 1 && (
                              <>
                                {d.code}
                                <Link
                                  href={`https://result.swim.or.jp/tournament/${d.code}`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <ExternalLink className="size-4" />
                                </Link>
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            {d.title.substring(0, 10)}
                            {d.title.length > 10 && "..."}
                          </TableCell>
                          <TableCell>
                            {meetKind.find((v) => v.id === d.kind)?.kind}
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
                            {d.deadline &&
                              format(d.deadline, "PPP", { locale: ja })}
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
                            {d.approved && <CheckIcon className="size-4" />}
                          </TableCell>
                          <TableCell>
                            {d.approvedUser?.displayName ||
                              d.approvedUser?.name}
                          </TableCell>
                          <TableCell className="flex-none text-center w-12">
                            <UpdateForm
                              key={d.id}
                              id={d.id}
                              fetchListData={fetchListData}
                            />
                          </TableCell>
                          <TableCell className="flex-none text-center w-12">
                            <ExcludeForm
                              key={d.id}
                              id={d.id}
                              fetchListData={fetchListData}
                            />
                          </TableCell>

                          <TableCell className="flex-none text-center w-12">
                            <ApproveForm
                              key={d.id}
                              id={d.id}
                              fetchListData={fetchListData}
                            />
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
      {/* <ReOrder fetchListData={fetchListData} /> */}
    </>
  );
}
