"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Award, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { getList } from "@/lib/record/actions";
import type { recordSchemaType } from "@/lib/record/verification";
import {
  intToTime,
  recordCategory,
  recordDistance,
  recordPoolsize,
  recordSex,
  recordStyle,
} from "@/lib/utils";

type Props = {
  category: "prefecture" | "high" | "junior_high" | "elementary";
  poolsize: "long" | "short";
  sex: "men" | "women" | "mixed";
};

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function RecordList(props: Props) {
  const router = useRouter();
  const { category, poolsize, sex } = props;

  const [record, setRecord] = useState<recordSchemaType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const now = new Date();
  const year =
    now.getMonth() <= 3 && now.getDate() <= 31
      ? now.getFullYear() - 1
      : now.getFullYear();
  const nextYear = year + 1;

  const getRecord = async (category: string, poolsize: string, sex: string) => {
    const categoryNum =
      recordCategory.find((v) => v.herf === category)?.id || 0;
    const poolsizeNum =
      recordPoolsize.find((v) => v.herf === poolsize)?.id || 0;
    const sexNum = recordSex.find((v) => v.herf === sex)?.id || 0;
    try {
      const fetchURL = await fetch(
        `/record_${categoryNum}_${poolsizeNum}_${sexNum}`,
      );
      const URL = await fetchURL.json();
      const response = await fetch(`${URL}`);

      if (!response.ok) {
        console.log("JSON file doesn't exist.");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const recordList = await response.json();
      const recordNum = recordList.length;
      const lastUpdateDate = recordList.reduce(
        (a: recordSchemaType, b: recordSchemaType) => (a.date > b.date ? a : b),
      );
      setRecord(recordList);
      setDataNum(recordNum);
      setLastUpdated(lastUpdateDate.date);
      setIsReady(true);
    } catch (error) {
      const recordList = await getList(categoryNum, poolsizeNum, sexNum);

      if (recordList !== null) {
        const recordNum = recordList.length;
        const lastUpdateDate = recordList.reduce(
          (a: recordSchemaType, b: recordSchemaType) =>
            a.date > b.date ? a : b,
        );
        setRecord(recordList);
        setDataNum(recordNum);
        setLastUpdated(lastUpdateDate.date);
        setIsReady(true);
      }
    }
  };

  useEffect(() => {
    setIsReady(false);
    getRecord(category, poolsize, sex);
  }, [category, poolsize, sex]);

  const handleChange = (e: string) => {
    router.push(`/record/${e}`);
    setIsReady(false);
  };

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            県記録
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            {format(lastUpdated, "PPP", { locale: ja })}現在
          </p>
          <Link href="/record-pdf" className="mt-16 flex items-center">
            高知県記録一覧（PDF）
            <FileText className="h-4" />
          </Link>
          <div className="mt-16 space-y-20 lg:mt-20">
            <Tabs
              defaultValue={`${category}/${poolsize}/${sex}`}
              onValueChange={(e) => handleChange(e)}
            >
              <TabsList>
                <TabsTrigger value={`prefecture/${poolsize}/${sex}`}>
                  県記録
                </TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value={`high/${poolsize}/${sex}`}>
                  高校記録
                </TabsTrigger>
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
                  <TabsTrigger value={`${category}/long/${sex}`}>
                    長水路
                  </TabsTrigger>
                  <Separator orientation="vertical" />
                  <TabsTrigger value={`${category}/short/${sex}`}>
                    短水路
                  </TabsTrigger>
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
                    {/* <TabsTrigger value={`${category}/${poolsize}/mixed`}>
                      混合
                    </TabsTrigger> */}
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
                          <TableHead>種目</TableHead>
                          <TableHead>距離</TableHead>
                          <TableHead>タイム</TableHead>
                          <TableHead>新記録</TableHead>
                          <TableHead>選手名</TableHead>
                          <TableHead>所属</TableHead>
                          <TableHead>樹立日</TableHead>
                          <TableHead>大会名</TableHead>
                          <TableHead>会場</TableHead>
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
                          : record.map((d) => {
                              return (
                                <TableRow key={d.id}>
                                  <TableCell>
                                    {
                                      recordStyle.find((v) => v.id === d.style)
                                        ?.label
                                    }
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {
                                      recordDistance.find(
                                        (v) => v.id === d.distance,
                                      )?.label
                                    }
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {intToTime(d.time)}
                                  </TableCell>
                                  <TableCell className="justify-items-center">
                                    {new Date(d.date) >=
                                      new Date(`${year}/4/1`) &&
                                      new Date(d.date) <=
                                        new Date(`${nextYear}/3/31`) && (
                                        <Award className="size-4 text-destructive" />
                                      )}
                                  </TableCell>
                                  <TableCell>
                                    {d.swimmer1}
                                    {d.style >= 6 &&
                                      `・${d.swimmer2}・${d.swimmer3}・${d.swimmer4}`}
                                  </TableCell>
                                  <TableCell>{d.team}</TableCell>
                                  <TableCell>
                                    {d.date &&
                                      format(d.date, "PPP", { locale: ja })}
                                  </TableCell>
                                  <TableCell>{d.meetName}</TableCell>
                                  <TableCell>{d.place}</TableCell>
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
          </div>
        </div>
      </div>
    </div>
  );
}
