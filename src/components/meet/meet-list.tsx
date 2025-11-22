"use client";

import axios from "axios";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Check, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

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
import { getList } from "@/lib/meet/actions";
import type { meetWithUserSchemaType } from "@/lib/meet/verification";
import { meetKind, poolSize } from "@/lib/utils";

interface Props {
  kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  year: number;
}

type meetListWithOpenType = meetWithUserSchemaType & {
  open: boolean;
};
export default function MeetList(props: Props) {
  const router = useRouter();
  const { kind, year } = props;
  const [meet, setMeet] = useState<meetListWithOpenType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getMeet = async (kind: string, year: number) => {
    const now = new Date();
    const thisYear =
      now.getMonth() <= 3 && now.getDate() <= 31
        ? now.getFullYear() - 1
        : now.getFullYear();

    if (kind === "swimming" && year === thisYear) {
      const meetList = await axios.get("/meet_list_top");
      const meetListNum = await axios.get("/meet_list_top_num");
      if (meetList.status === 200 && meetListNum.status === 200) {
        const meetListWithOpen = meetList.data.map(
          (v: meetWithUserSchemaType) => {
            return { ...JSON.parse(JSON.stringify(v)), open: false };
          },
        );
        setMeet(meetListWithOpen);
      }
    } else {
      const kindNum = meetKind.find((v) => v.href === kind)?.id || 0;
      const meetList = await getList(kindNum, year);
      const meetListWithOpen = meetList.map((v) => {
        return { ...v, open: false };
      });
      setMeet(meetListWithOpen);
    }
    setIsReady(true);
  };

  const handleChange = (e: string) => {
    router.push(`/meet/${e}`);
    setIsReady(false);
  };

  const handleOpen = (id: string) => {
    const meetListWithOpen = meet.map((v) => {
      if (v.id === id) {
        return { ...v, open: !v.open };
      } else {
        return { ...v, open: false };
      }
    });
    setMeet(meetListWithOpen);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(false);
    getMeet(kind, year);
  }, [kind, year]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            競技会情報
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
          <div className="mt-16 lg:mt-20">
            <Tabs
              defaultValue={`${kind}/${year}`}
              onValueChange={(e) => handleChange(e)}
            >
              <TabsList>
                <TabsTrigger value={`swimming/${year}`}>競泳</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value={`diving/${year}`}>飛込</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value={`waterpolo/${year}`}>水球</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value={`as/${year}`}>AS</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value={`ow/${year}`}>OW</TabsTrigger>
              </TabsList>
              <Tabs
                defaultValue={`${kind}/${year}`}
                onValueChange={(e) => handleChange(e)}
              >
                <TabsList>
                  <TabsTrigger value={`${kind}/2025`}>2025年度</TabsTrigger>
                  <Separator orientation="vertical" />
                  <TabsTrigger value={`${kind}/2026`}>2026年度</TabsTrigger>
                </TabsList>
                <TabsContent value={`${kind}/${year}`}>
                  <p
                    hidden={!isReady}
                    className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white"
                  >
                    {meetKind.find((v) => v.href === kind)?.kind}
                  </p>
                  <div hidden={isReady} className="p-2">
                    <Skeleton className="p-2 w-xs h-6 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white" />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>開催日</TableHead>
                        <TableHead>大会名</TableHead>
                        <TableHead>会場</TableHead>
                        <TableHead>水路</TableHead>
                        <TableHead>詳細</TableHead>
                        {kind === "swimming" && <TableHead>結果</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isReady
                        ? (function () {
                            const rows = [];
                            for (let i = 0; i < 10; i++) {
                              rows.push(
                                <TableRow key={i}>
                                  <TableCell>
                                    <Skeleton className="w-48 h-5 my-2" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="w-96 h-5 my-2" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="w-36 h-5 my-2" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="w-16 h-5 my-2" />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton className="w-16 h-5 my-2" />
                                  </TableCell>
                                  {kind === "swimming" && (
                                    <TableCell>
                                      <Skeleton className="w-16 h-5 my-2" />
                                    </TableCell>
                                  )}
                                </TableRow>,
                              );
                            }
                            return <>{rows}</>;
                          })()
                        : meet.map((m) => (
                            <Fragment key={m.id}>
                              <TableRow>
                                <TableCell>
                                  {m.fromDate &&
                                    format(m.fromDate, "PPP", {
                                      locale: ja,
                                    })}
                                  {m.toDate && "〜"}
                                  {m.toDate &&
                                    format(m.toDate, "M月d日", {
                                      locale: ja,
                                    })}
                                </TableCell>
                                <TableCell>{m.title}</TableCell>
                                <TableCell>{m.place}</TableCell>
                                <TableCell>
                                  {
                                    poolSize.find((v) => v.id === m.poolsize)
                                      ?.size
                                  }
                                </TableCell>
                                <TableCell>
                                  {!m.description &&
                                  !m.detail &&
                                  !m.attachment ? null : (
                                    <Button
                                      onClick={() => handleOpen(m.id)}
                                      variant="ghost"
                                    >
                                      {m.open ? (
                                        <ChevronsDownUp />
                                      ) : (
                                        <ChevronsUpDown />
                                      )}
                                    </Button>
                                  )}
                                </TableCell>
                                {kind === "swimming" && (
                                  <TableCell>
                                    {m.result ? (
                                      <Button variant="ghost">
                                        {m.code !== null ? (
                                          <Link
                                            href={`https://result.swim.or.jp/tournament/${m.code}`}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                          >
                                            <Check />
                                          </Link>
                                        ) : (
                                          <Check />
                                        )}
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                              {m.open && (
                                <TableRow className="bg-accent">
                                  <TableCell colSpan={6}>
                                    {m.description && (
                                      <div className="grid justify-start">
                                        [詳細情報]
                                        <div className="whitespace-pre-wrap p-4">
                                          {m.description}
                                        </div>
                                      </div>
                                    )}
                                    {m.detail && (
                                      <div className="grid justify-start">
                                        [要項ファイル]
                                        {JSON.parse(m.detail!) &&
                                          JSON.parse(m.detail!).map(
                                            (
                                              v: {
                                                value: string;
                                                name: string;
                                              },
                                              i: number,
                                            ) => {
                                              return (
                                                <Button
                                                  variant="link"
                                                  key={i}
                                                  className="w-fit"
                                                >
                                                  <Link
                                                    href={`${v.value}`}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    key={i}
                                                  >
                                                    {v.name.length > 0
                                                      ? v.name
                                                      : "無題"}
                                                  </Link>
                                                </Button>
                                              );
                                            },
                                          )}
                                      </div>
                                    )}
                                    {m.attachment && (
                                      <div className="grid justify-start">
                                        [添付ファイル]
                                        {JSON.parse(m.attachment!) &&
                                          JSON.parse(m.attachment!).map(
                                            (
                                              v: {
                                                value: string;
                                                name: string;
                                              },
                                              i: number,
                                            ) => {
                                              return (
                                                <Button
                                                  variant="link"
                                                  key={i}
                                                  className="w-fit"
                                                >
                                                  <Link
                                                    href={`${v.value}`}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    key={i}
                                                  >
                                                    {v.name.length > 0
                                                      ? v.name
                                                      : "無題"}
                                                  </Link>
                                                </Button>
                                              );
                                            },
                                          )}
                                      </div>
                                    )}
                                    {!m.description &&
                                      !m.detail &&
                                      !m.attachment && (
                                        <div>詳細情報はありません。</div>
                                      )}
                                  </TableCell>
                                </TableRow>
                              )}
                            </Fragment>
                          ))}
                    </TableBody>
                  </Table>
                  <hr />
                </TabsContent>
              </Tabs>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
