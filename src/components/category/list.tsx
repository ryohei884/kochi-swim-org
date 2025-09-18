"use client";

import { getCategoryList, deleteCategory } from "@/lib/actions";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Link from "next/link";
import { SettingsIcon, Trash2Icon, PlusIcon } from "lucide-react";
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

type dataType = {
  categoryId: string;
  name: string;
  link: string;
  order: number;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
};

import { toast } from "sonner";

export default function CategoryList() {
  const [data, setData] = useState<dataType[]>([]);
  const fetchData = async () => {
    const res = await getCategoryList();
    if (res !== null) {
      setData(res);
      console.log(res);
    }
  };

  const handleClick = async (id: string) => {
    const res = await deleteCategory(id);
    if (res !== null) {
      fetchData();
      console.log(res);
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
    fetchData();
  }, []);

  return (
    <>
      {" "}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        カテゴリー{" "}
        <Link href="./create">
          <Button variant="outline" size="sm">
            <PlusIcon /> カテゴリーを追加
          </Button>
        </Link>
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
            <TableHead className="text-center">変更</TableHead>
            <TableHead className="text-center">削除</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((value, index) => (
            <TableRow key={index}>
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
                  categoryPermission.find((v) => v.range === value.permission)
                    ?.label
                }
              </TableCell>
              <TableCell>
                {format(value.createdAt, "PPP", { locale: ja })}
              </TableCell>
              <TableCell>
                {format(value.updatedAt, "PPP", { locale: ja })}
              </TableCell>
              <TableCell className="flex-auto text-center">
                <Button className="p-3" variant="ghost">
                  <Link href={`./update/${value.categoryId}`}>
                    <SettingsIcon className="opacity-50" />
                  </Link>
                </Button>
              </TableCell>
              <TableCell className="flex-auto text-center">
                <Button
                  onClick={() => handleClick(value.categoryId)}
                  variant="ghost"
                >
                  <Trash2Icon className="opacity-50" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <hr />
    </>
  );
}
