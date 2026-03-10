"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Check } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

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
import { getById } from "@/lib/meet/actions";
import type { meetSchemaType } from "@/lib/meet/verification";
import { meetKind, poolSize } from "@/lib/utils";

interface Props {
  // kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  // year: number;
  id: string;
}

export default function MeetItem(props: Props) {
  const { id } = props;
  const [meet, setMeet] = useState<meetSchemaType | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [kind, setKind] = useState<string | undefined>(undefined);

  const getMeet = async (id: string) => {
    try {
      const res = await getById({ id: id });
      if (res !== null) {
        setMeet(res);
        setYear(
          res.fromDate.getMonth() <= 3 && res.fromDate.getDay() <= 31
            ? res.fromDate.getFullYear() - 1
            : res.fromDate.getFullYear(),
        );
        setKind(meetKind.find((v) => v.id === res.kind)?.href);
      }
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getMeet(id);
  }, [id]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            競技会情報
          </h2>
          <div className="mt-16 lg:mt-20">
            <p
              hidden={meet === undefined}
              className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white"
            >
              {meetKind.find((v) => v.id === meet?.kind)?.kind}
            </p>
            <div hidden={meet !== undefined} className="p-2">
              <Skeleton className="p-2 w-xs h-6 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>開催日</TableHead>
                  <TableHead>大会名</TableHead>
                  <TableHead>会場</TableHead>
                  <TableHead>水路</TableHead>
                  {meet?.kind === 1 && <TableHead>結果</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!meet ? (
                  <TableRow key="skelton">
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
                  </TableRow>
                ) : (
                  <Fragment key="fragment">
                    <TableRow>
                      <TableCell>
                        {meet.fromDate &&
                          format(meet.fromDate, "PPP", {
                            locale: ja,
                          })}
                        {meet.toDate && "〜"}
                        {meet.toDate &&
                          format(meet.toDate, "M月d日", {
                            locale: ja,
                          })}
                      </TableCell>
                      <TableCell>{meet.title}</TableCell>
                      <TableCell>{meet.place}</TableCell>
                      <TableCell>
                        {poolSize.find((v) => v.id === meet.poolsize)?.size}
                      </TableCell>
                      {meet.kind === 1 && (
                        <TableCell>
                          {meet.result ? (
                            <Button variant="ghost">
                              {meet.code !== null ? (
                                <Link
                                  href={`https://result.swimeet.or.jp/tournament/${meet.code}`}
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
                    <TableRow className="bg-accent">
                      <TableCell colSpan={6}>
                        {meet.description && (
                          <div className="grid justify-start">
                            [詳細情報]
                            <div className="whitespace-pre-wrap p-4">
                              {meet.description}
                            </div>
                          </div>
                        )}
                        {meet.detail && (
                          <div className="grid justify-start">
                            [要項ファイル]
                            {JSON.parse(meet.detail!) &&
                              JSON.parse(meet.detail!).map(
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
                                        {v.name.length > 0 ? v.name : "無題"}
                                      </Link>
                                    </Button>
                                  );
                                },
                              )}
                          </div>
                        )}
                        {meet.attachment && (
                          <div className="grid justify-start">
                            [添付ファイル]
                            {JSON.parse(meet.attachment!) &&
                              JSON.parse(meet.attachment!).map(
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
                                        {v.name.length > 0 ? v.name : "無題"}
                                      </Link>
                                    </Button>
                                  );
                                },
                              )}
                          </div>
                        )}
                        {!meet.description &&
                          !meet.detail &&
                          !meet.attachment && <div>詳細情報はありません。</div>}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="float-end  mt-16">
            <Link
              href={`/meet/${kind}/${year}`}
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              競技会情報一覧 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
