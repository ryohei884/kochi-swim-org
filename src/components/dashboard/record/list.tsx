"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CheckIcon, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ApproveForm from "@/components/dashboard/record/approve-form";
import CreateForm from "@/components/dashboard/record/create-form";
import ExcludeForm from "@/components/dashboard/record/exclude-form";
import UpdateForm from "@/components/dashboard/record/update-form";
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
import { getByIdAdmin, getListAdmin } from "@/lib/record/actions";
import type { recordWithUserSchemaType } from "@/lib/record/verification";
import {
  copyToClipboard,
  intToTime,
  recordCategory,
  recordDistance,
  recordPoolsize,
  recordSex,
  recordStyle,
} from "@/lib/utils";

interface Props {
  category: "prefecture" | "high" | "junior_high" | "elementary";
  poolsize: "long" | "short";
  sex: "men" | "women" | "mixed";
}

export default function RecordList(props: Props) {
  const router = useRouter();
  const { category, poolsize, sex } = props;
  const [data, setData] = useState<recordWithUserSchemaType[]>([]);
  const [callbackData, setCallbackData] = useState<string | undefined>(
    undefined,
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);

  const fetchData = async (
    category: string,
    poolsize: string,
    sex: string,
    id?: string,
  ) => {
    data && setCallbackData(id);
    const categoryNum =
      recordCategory.find((v) => v.herf === category)?.id || 0;
    const poolsizeNum =
      recordPoolsize.find((v) => v.herf === poolsize)?.id || 0;
    const sexNum = recordSex.find((v) => v.herf === sex)?.id || 0;
    const res = await getListAdmin(categoryNum, poolsizeNum, sexNum);

    if (res !== null) {
      const recordNum = res.length;
      setData(res);
      setDataNum(recordNum);
      setIsReady(true);
    }
  };

  const fetchListData = async (id?: string) => {
    // data && setCallbackData(id);
    if (id !== undefined) {
      const resRecord = await getByIdAdmin(id);
      if (resRecord !== null) {
        const resList = await getListAdmin(
          resRecord.category,
          resRecord.poolsize,
          resRecord.sex,
        );
        if (resList !== null) {
          const category = recordCategory.find(
            (v) => v.id === resRecord.category,
          )?.herf;
          const poolsize = recordPoolsize.find(
            (v) => v.id === resRecord.poolsize,
          )?.herf;
          const sex = recordSex.find((v) => v.id === resRecord.sex)?.herf;
          setData(resList);
          //   setDataNum(resList.length());
          setCallbackData(id);
          router.push(`/dashboard/record/${category}/${poolsize}/${sex}`);
          setIsReady(true);
        }
      }
    } else {
      const categoryNum =
        recordCategory.find((v) => v.herf === category)?.id || 0;
      const poolsizeNum =
        recordPoolsize.find((v) => v.herf === poolsize)?.id || 0;
      const sexNum = recordSex.find((v) => v.herf === sex)?.id || 0;
      const resList = await getListAdmin(categoryNum, poolsizeNum, sexNum);
      if (resList !== null) {
        setData(resList);
        setDataNum(resList.length);
        setCallbackData(undefined);
        setIsReady(true);
      }
    }
  };

  const handleChange = (e: string) => {
    router.push(`/dashboard/record/${e}`);
    setIsReady(false);
  };

  useEffect(() => {
    setIsReady(false);
    fetchData(category, poolsize, sex, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, poolsize, sex]);

  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        県記録 <CreateForm fetchListData={fetchListData} />
      </h4>
      <Tabs
        defaultValue={`${category}/${poolsize}/${sex}`}
        onValueChange={(e) => handleChange(e)}
      >
        <TabsList>
          <TabsTrigger value={`prefecture/${poolsize}/${sex}`}>
            県記録
          </TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`high/${poolsize}/${sex}`}>高校記録</TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`junior_high/${poolsize}/${sex}`}>
            中学記録
          </TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value={`elementary/${poolsize}/${sex}`}>
            学童記録
          </TabsTrigger>
        </TabsList>
        <Tabs
          defaultValue={`${category}/${poolsize}/${sex}`}
          onValueChange={(e) => handleChange(e)}
        >
          <TabsList>
            <TabsTrigger value={`${category}/long/${sex}`}>長水路</TabsTrigger>
            <Separator orientation="vertical" />
            <TabsTrigger value={`${category}/short/${sex}`}>短水路</TabsTrigger>
          </TabsList>
          <Tabs
            defaultValue={`${category}/${poolsize}/${sex}`}
            onValueChange={(e) => handleChange(e)}
          >
            <TabsList>
              <TabsTrigger value={`${category}/${poolsize}/men`}>
                男子
              </TabsTrigger>
              <Separator orientation="vertical" />
              <TabsTrigger value={`${category}/${poolsize}/women`}>
                女子
              </TabsTrigger>
              <TabsTrigger value={`${category}/${poolsize}/mixed`}>
                混合
              </TabsTrigger>
            </TabsList>
            <TabsContent value={`${category}/${poolsize}/${sex}`}>
              <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
                {recordCategory.find((v) => v.herf === category)?.label} /{" "}
                {recordPoolsize.find((v) => v.herf === poolsize)?.label} /{" "}
                {recordSex.find((v) => v.herf === sex)?.label}
              </p>
              <hr />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>種目</TableHead>
                    <TableHead>距離</TableHead>
                    <TableHead>タイム</TableHead>
                    <TableHead>保持者</TableHead>
                    <TableHead>チーム</TableHead>
                    <TableHead>樹立日</TableHead>
                    <TableHead>大会名</TableHead>
                    <TableHead>場所</TableHead>
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
                              {(function () {
                                const cols = [];
                                for (let j = 0; j < 13; j++) {
                                  cols.push(
                                    <TableCell key={`${i}_${j}`}>
                                      <Skeleton className="flex h-6 w-full border border-input p-2 file:border-0 max-w-full" />
                                    </TableCell>,
                                  );
                                }
                                return <>{cols}</>;
                              })()}
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
                              {recordStyle.find((v) => v.id === d.style)?.label}
                            </TableCell>
                            <TableCell>
                              {
                                recordDistance.find((v) => v.id === d.distance)
                                  ?.label
                              }
                            </TableCell>
                            <TableCell>{intToTime(d.time)}</TableCell>
                            <TableCell>{d.swimmer1}</TableCell>
                            <TableCell>{d.team}</TableCell>
                            <TableCell>
                              {d.date && format(d.date, "PPP", { locale: ja })}
                            </TableCell>
                            <TableCell>{d.meetName}</TableCell>
                            <TableCell>{d.place}</TableCell>
                            <TableCell>
                              {d.createdUser.displayName || d.createdUser.name}
                            </TableCell>
                            <TableCell>
                              {d.revisedUser?.displayName ||
                                d.revisedUser?.name}
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
                              {d.approved ? (
                                <Button variant="ghost" size="sm" disabled>
                                  <CheckIcon className="size-4" />
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
        </Tabs>
      </Tabs>
      {/* <ReOrder fetchListData={fetchListData} /> */}
    </>
  );
}
