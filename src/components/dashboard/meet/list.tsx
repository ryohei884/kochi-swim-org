"use client";

// import ReOrder from "@/components/dashboard/news/reorder";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

import type { meetWithUserSchemaType } from "@/lib/meet/verification";

// import ApproveForm from "@/components/dashboard/news/approve-form";
import CreateForm from "@/components/dashboard/meet/create-form";
// import ExcludeForm from "@/components/dashboard/news/exclude-form";
import UpdateForm from "@/components/dashboard/meet/update-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getList } from "@/lib/meet/actions";
import { meetKind, poolSize } from "@/lib/utils";

export default function MeetList() {
  const [data, setData] = useState<meetWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  // const [maxOrder, setMaxOrder] = useState<number>(0);

  const fetchListData = async (id?: string) => {
    setIsReady(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data && setCallbackData(id);
    const res = await getList();
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
      // const orders = res.map((value) => value.order);
      // setMaxOrder(Math.max(...orders) + 1);
      setIsReady(true);
    }
  };

  useEffect(() => {
    fetchListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        競技会情報 <CreateForm fetchListData={fetchListData} />
      </h4>
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
                      {d.fromDate && format(d.fromDate, "PPP", { locale: ja })}
                      {d.toDate &&
                        `〜 ${format(d.toDate, "PPP", { locale: ja })}`}
                    </TableCell>
                    <TableCell>{d.place}</TableCell>
                    <TableCell>
                      {poolSize.find((v) => v.id === d.poolsize)?.size}
                    </TableCell>
                    <TableCell>
                      {d.deadline && format(d.deadline, "PPP", { locale: ja })}
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
                    <TableCell>{d.createdUser.name}</TableCell>
                    <TableCell>{d.revisedUser?.name}</TableCell>
                    <TableCell>
                      {d.approved && <CheckIcon className="size-4" />}
                    </TableCell>
                    <TableCell>{d.approvedUser?.name}</TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <UpdateForm
                        key={d.id}
                        id={d.id}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
                    {/* 
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
                    </TableCell> */}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <hr />
      {/* <ReOrder fetchListData={fetchListData} /> */}
    </>
  );
}
