"use client";
import { useState, useEffect, Fragment } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Play } from "lucide-react";

import type { liveWithUserSchemaType } from "@/lib/live/verification";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getList, getListNum } from "@/lib/live/actions";
import { poolSize } from "@/lib/utils";

interface Props {
  page: string;
}

export default function LiveList(props: Props) {
  const { page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [live, setLive] = useState<liveWithUserSchemaType[]>([]);
  const [liveNum, setLiveNum] = useState<number>(0);

  const getLive = async (page: number) => {
    const liveList = await getList(page);
    setLive(liveList);
    const liveListNum = await getListNum();
    setLiveNum(liveListNum);
  };

  useEffect(() => {
    getLive(Number(page));
  }, [page]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            ライブ配信情報
          </h2>
          <div className="mt-16 space-y-20 lg:mt-20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>視聴</TableHead>
                  <TableHead>題名</TableHead>
                  <TableHead>大会名</TableHead>
                  <TableHead>会場</TableHead>
                  <TableHead>配信開始日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {live.map((m) => (
                  <Fragment key={m.id}>
                    <TableRow>
                      <TableCell>
                        <Play />
                      </TableCell>
                      <TableCell>{m.title}</TableCell>
                      <TableCell>{m.meet && m.meet.title}</TableCell>
                      <TableCell>
                        {m.meet && m.meet?.place}{" "}
                        {m.meet &&
                          "(" +
                            poolSize.find((v) => v.id === m.meet?.poolsize)
                              ?.size +
                            ")"}
                      </TableCell>
                      <TableCell>
                        {m.fromDate &&
                          format(m.fromDate, "PPP", {
                            locale: ja,
                          })}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-16 flex items-center justify-between">
              <PaginationContent className="-mt-px flex w-0 flex-1">
                <PaginationItem className="inline-flex items-center">
                  <PaginationPrevious
                    href={`/live/${previousPage}`}
                    hidden={previousPage < 1}
                  />
                </PaginationItem>
                <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                  <PaginationNext
                    href={`/live/${nextPage}`}
                    className="inline-flex items-center"
                    hidden={liveNum <= (Number(page) - 1) * 10}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
