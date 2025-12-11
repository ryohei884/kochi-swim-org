"use client";
import type { DefaultSession } from "@auth/core/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, Copy, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ApproveForm from "@/components/dashboard/seminar/approve-form";
import CreateForm from "@/components/dashboard/seminar/create-form";
import ExcludeForm from "@/components/dashboard/seminar/exclude-form";
import UpdateForm from "@/components/dashboard/seminar/update-form";
import { Button } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getListAdmin, getListNumAdmin } from "@/lib/seminar/actions";
import type { seminarWithUserSchemaType } from "@/lib/seminar/verification";
import { copyToClipboard } from "@/lib/utils";

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
  year: number;
  session: Session | null;
  permission: Permission;
  approver: Approver;
}

export default function SeminarList(props: Props) {
  const router = useRouter();
  const { year, session, permission, approver } = props;

  const [data, setData] = useState<seminarWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const pms: Permission = permission.filter(
    (v) => v.categoryLink === "seminar",
  );

  const fetchData = async (year: number, id?: string) => {
    data && setCallbackData(id);
    const res = await getListAdmin(year);

    if (res !== null) {
      const seminarNum = await getListNumAdmin(year);
      setData(res);
      setDataNum(seminarNum);
      setIsReady(true);
    }
  };

  const fetchListData = async (id?: string) => {
    data && setCallbackData(id);
    const res = await getListAdmin(year);

    if (res !== null) {
      setData(res);
      const seminarNum = await getListNumAdmin();
      setDataNum(seminarNum);
      setIsReady(true);
    } else {
      setData(res);
      setDataNum(0);
      setIsReady(true);
    }
  };

  const handleChange = (e: string) => {
    router.push(`/dashboard/seminar/${e}`);
    setIsReady(false);
  };

  useEffect(() => {
    setIsReady(false);
    fetchData(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

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
        講習会情報
        {isReady &&
          (pms.filter((v) => v.submit === true).length > 0 ||
            session?.user.role === "administrator") && (
            <CreateForm fetchListData={fetchListData} approver={approver} />
          )}
      </h4>
      <Tabs defaultValue={`${year}`} onValueChange={(e) => handleChange(e)}>
        <TabsList>
          <TabsTrigger value="2025">2025</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value="2026">2026</TabsTrigger>
        </TabsList>
        <TabsContent value={`${year}`}>
          <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
            {year}年度
          </p>
          <hr />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>講習会名</TableHead>
                <TableHead>開催期間</TableHead>
                <TableHead>会場</TableHead>
                <TableHead>申込締切</TableHead>
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
                          {d.approvedUser?.displayName || d.approvedUser?.name}
                        </TableCell>
                        <TableCell className="flex-none text-center w-12">
                          {pms.filter((v) => v.revise === true).length ===
                            0 /*||
                            (d.approved === true &&
                              d.createdUserId !== session?.user.id &&
                              d.revisedUserId !== session?.user.id)*/ &&
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
                          {pms.filter((v) => v.exclude === true).length ===
                            0 /*||
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
        </TabsContent>
      </Tabs>
      {/* <ReOrder fetchListData={fetchListData} /> */}
    </>
  );
}
