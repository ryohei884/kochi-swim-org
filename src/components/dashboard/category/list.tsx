"use client";

import { useState, useEffect } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Link from "next/link";

import type { categoryWithUserSchemaType } from "@/lib/category/verification";

import CreateForm from "@/components/dashboard/category/create-form";
import ExcludeForm from "@/components/dashboard/category/exclude-form";
import ReOrder from "@/components/dashboard/category/reorder";
import UpdateForm from "@/components/dashboard/category/update-form";
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
import { getList } from "@/lib/category/actions";
import { categoryDisplay } from "@/lib/category/role";

export default function CategoryList() {
  const [data, setData] = useState<categoryWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<
    categoryWithUserSchemaType | undefined
  >(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  const [maxOrder, setMaxOrder] = useState<number>(0);

  const fetchListData = async (data?: categoryWithUserSchemaType) => {
    setIsReady(false);

    data && setCallbackData(data);
    const res = await getList();
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
      const orders = res.map((value) => value.order);
      setMaxOrder(Math.max(...orders) + 1);
      setIsReady(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchListData();
  }, []);

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        カテゴリー{" "}
        <CreateForm fetchListData={fetchListData} maxOrder={maxOrder} />
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>カテゴリー名</TableHead>
            <TableHead>リンク先</TableHead>
            <TableHead>表示順序</TableHead>
            <TableHead>表示対象者</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>最終更新日</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>更新者</TableHead>
            <TableHead className="flex-none text-center w-12">変更</TableHead>
            <TableHead className="flex-none text-center w-12">削除</TableHead>
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
                      <TableCell className="flex-none justify-items-center w-12">
                        <Skeleton className="size-6 border border-input file:border-0" />
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
            : data.map((value, index) => {
                return (
                  <TableRow
                    key={index}
                    className={callbackData?.id === value.id ? "bg-muted" : ""}
                  >
                    <TableCell>{value.name}</TableCell>
                    <TableCell>
                      <Link href={`../${value.link}`}>
                        <Button variant="link" className="pl-0">
                          {value.link}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>{value.order}</TableCell>
                    <TableCell>
                      {
                        categoryDisplay.find((v) => v.range === value.role)
                          ?.label
                      }
                    </TableCell>
                    <TableCell>
                      {format(value.createdAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {format(value.updatedAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {value.createdUser.displayName || value.createdUser.name}
                    </TableCell>
                    <TableCell>
                      {value.updatedUser?.displayName ||
                        value.updatedUser?.name}
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <UpdateForm
                        key={value.id}
                        id={value.id}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <ExcludeForm
                        key={value.id}
                        id={value.id}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <hr />
      <ReOrder fetchListData={fetchListData} />
    </>
  );
}
