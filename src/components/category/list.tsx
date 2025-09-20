"use client";

import { getCategoryList, deleteCategory } from "@/lib/actions";
import CreateForm from "@/components/category/create-form";
import UpdateForm from "@/components/category/update-form";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { categoryPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type dataType = {
  categoryId: string;
  name: string;
  link: string;
  order: number;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
  createdUserId: string;
};

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryList() {
  const [data, setData] = useState<dataType[]>([]);
  const [callbackData, setCallbackData] = useState<dataType | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  const fetchListData = async (data?: dataType) => {
    setCallbackData(data);
    const res = await getCategoryList();
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
      setIsReady(true);
    }
  };

  const handleClick = async (id: string) => {
    const res = await deleteCategory(id);
    if (res !== null) {
      fetchListData();
      toast("You delete the following values", {
        description: <div>{JSON.stringify(res, null, 2)}</div>,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        カテゴリー <CreateForm fetchListData={fetchListData} />
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>カテゴリ名</TableHead>
            <TableHead>リンク先</TableHead>
            <TableHead>表示順序</TableHead>
            <TableHead>表示対象者</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>最終更新日</TableHead>
            <TableHead>作成者ID</TableHead>
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
                    className={
                      callbackData?.categoryId === value.categoryId
                        ? "bg-muted"
                        : ""
                    }
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
                        categoryPermission.find(
                          (v) => v.range === value.permission,
                        )?.label
                      }
                    </TableCell>
                    <TableCell>
                      {format(value.createdAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {format(value.updatedAt, "PPP", { locale: ja })}
                    </TableCell>
                    <TableCell>{value.createdUserId}</TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <UpdateForm
                        key={value.categoryId}
                        id={value.categoryId}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <Button
                        onClick={() => handleClick(value.categoryId)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2Icon />
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
