"use client";

import { getList } from "@/lib/news/actions";
import CreateForm from "@/components/news/create-form";
// import UpdateForm from "@/components/group/update-form";
// import ExcludeForm from "@/components/group/exclude-form";
// import MemberForm from "@/components/group/member-form";
// import PermissionForm from "@/components/group/permission-form";
// import ReOrder from "@/components/group/reorder";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, Trash2, PencilLine, Stamp } from "lucide-react";
import { newsWithUserSchemaType } from "@/lib/news/verification";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsList() {
  const [data, setData] = useState<newsWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<
    newsWithUserSchemaType | undefined
  >(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchListData = async (data?: newsWithUserSchemaType) => {
    setIsReady(false);
    await sleep(2000);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data && setCallbackData(data);
    const res = await getList();
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
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
        ニュース <CreateForm fetchListData={fetchListData} />
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>本文</TableHead>
            <TableHead>掲載期間</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>最終更新日</TableHead>
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
                    className={callbackData?.id === d.id ? "bg-muted" : ""}
                  >
                    <TableCell>
                      {d.title.substring(0, 10)}
                      {d.title.length > 10 && "..."}
                    </TableCell>
                    <TableCell>
                      {d.detail.substring(0, 10)}
                      {d.detail.length > 10 && "..."}
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
                    <TableCell>{d.createdUser.name}</TableCell>
                    <TableCell>{d.revisedUser?.name}</TableCell>
                    <TableCell>
                      {d.approved && <CheckIcon className="size-4" />}
                    </TableCell>
                    <TableCell>{d.approvedUser?.name}</TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <Button variant="ghost" size="sm">
                        <PencilLine />
                      </Button>
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <Button variant="ghost" size="sm">
                        <Trash2 />
                      </Button>
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <Button variant="ghost" size="sm">
                        <Stamp />
                      </Button>
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
