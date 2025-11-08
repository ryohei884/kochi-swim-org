"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

import type { groupWithUserSchemaType } from "@/lib/group/verification";

import CreateForm from "@/components/dashboard/group/create-form";
import ExcludeForm from "@/components/dashboard/group/exclude-form";
import MemberForm from "@/components/dashboard/group/member-form";
import PermissionForm from "@/components/dashboard/group/permission-form";
import UpdateForm from "@/components/dashboard/group/update-form";
// import ReOrder from "@/components/group/reorder";
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
import { getList } from "@/lib/group/actions";

export default function GroupList() {
  const [data, setData] = useState<groupWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<
    groupWithUserSchemaType | undefined
  >(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const fetchListData = async (data?: groupWithUserSchemaType) => {
    setIsReady(false);

    data && setCallbackData(data);
    const res = await getList();
    if (res !== null) {
      setData(res);
      setDataNum(res.length);
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
        グループ <CreateForm fetchListData={fetchListData} />
      </h4>
      <hr />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>グループ名</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>最終更新日</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>更新者</TableHead>
            <TableHead className="flex-none text-center w-12">変更</TableHead>
            <TableHead className="flex-none text-center w-12">削除</TableHead>
            <TableHead className="flex-none text-center w-12">
              メンバー
            </TableHead>
            <TableHead className="flex-none text-center w-12">権限</TableHead>
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
                    <TableCell className="flex-none text-center w-12">
                      <MemberForm
                        key={value.id}
                        id={value.id}
                        groupName={value.name}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
                    <TableCell className="flex-none text-center w-12">
                      <PermissionForm
                        key={value.id}
                        id={value.id}
                        groupName={value.name}
                        fetchListData={fetchListData}
                      />
                    </TableCell>
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
