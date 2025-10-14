"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

import type { liveWithUserSchemaType } from "@/lib/live/verification";

import CreateForm from "@/components/dashboard/live/create-form";
import ExcludeForm from "@/components/dashboard/live/exclude-form";
import UpdateForm from "@/components/dashboard/live/update-form";
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
import { getList } from "@/lib/live/actions";

interface Props {
  page: string;
}

export default function LiveList(props: Props) {
  const { page } = props;
  const [previousPage, setPreviousPage] = useState<number>(Number(page) - 1);
  const [nextPage, setNextPage] = useState<number>(Number(page) + 1);

  const [data, setData] = useState<liveWithUserSchemaType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined
  );
  const [dataNum, setDataNum] = useState<number>(3);
  const [maxOrder, setMaxOrder] = useState<number>(0);

  useEffect(() => {
    fetchListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListData = async (id?: string) => {
    setIsReady(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data && setCallbackData(id);
    const res = await getList(Number(page));
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
      const orders = res.map((value) => value.order);
      setMaxOrder(Math.max(...orders) + 1);
      if (page !== undefined) {
        setPreviousPage(Number(page) - 1);
        setNextPage(Number(page) + 1);
      }
      setIsReady(true);
    } else {
      setData(res);
      setDataNum(0);
      setMaxOrder(1);
      setIsReady(true);
    }
  };

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        ライブ配信{" "}
        <CreateForm fetchListData={fetchListData} maxOrder={maxOrder} />
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>表示順</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>配信開始日</TableHead>
            <TableHead>関連大会</TableHead>
            <TableHead>ライブ中継状態</TableHead>
            <TableHead>リンクURL</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead className="text-center">変更</TableHead>
            <TableHead className="text-center">削除</TableHead>
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
                    </TableRow>
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
                    <TableCell>{d.order}</TableCell>
                    <TableCell>
                      {d.title.substring(0, 10)}
                      {d.title.length > 10 && "..."}
                    </TableCell>
                    <TableCell>
                      {d.fromDate && format(d.fromDate, "PPP", { locale: ja })}{" "}
                    </TableCell>
                    <TableCell>
                      {d.meet && d.meet.title.substring(0, 10)}
                      {d.meet && d.meet.title.length > 10 && "..."}
                    </TableCell>
                    <TableCell>
                      {d.finished ? "終了" : d.onAir ? "配信中" : "配信前"}
                    </TableCell>
                    <TableCell>{d.url}</TableCell>
                    <TableCell>
                      {d.createdUser.displayName || d.createdUser.name}
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
                      {/* <ApproveForm
                        key={d.id}
                        id={d.id}
                        fetchListData={fetchListData}
                      /> */}
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
              href={`/dashboard/live/${previousPage}`}
              hidden={previousPage < 1}
            />
          </PaginationItem>
          <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
            <PaginationNext
              href={`/dashboard/live/${nextPage}`}
              className="inline-flex items-center"
              hidden={dataNum <= Number(page) * 10}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
