"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Play } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getList, getListNum } from "@/lib/live/actions";
import type { liveWithUserSchemaType } from "@/lib/live/verification";
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
  const [isReady, setIsReady] = useState<boolean>(false);

  const getLive = async (page: number) => {
    if (page === 1) {
      try {
        const fetchURL = await fetch("/live_top");
        const URL = await fetchURL.json();
        const response = await fetch(`${URL}`);

        const fetchURLTopNum = await fetch("/live_list_num");
        const NumTop = await fetchURLTopNum.json();

        if (!response.ok) {
          console.log("JSON file doesn't exist.");
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const liveList = await response.json();
        setLive(liveList);
        setLiveNum(NumTop);
        setIsReady(true);
      } catch (error) {
        const liveList = await getList(page);
        setLive(liveList);
        const liveListNum = await getListNum();
        setLiveNum(liveListNum);
        setIsReady(true);
      }
    } else {
      const liveList = await getList(page);
      setLive(liveList);
      const liveListNum = await getListNum();
      setLiveNum(liveListNum);
      setIsReady(true);
    }
  };

  useEffect(() => {
    setIsReady(false);
    getLive(Number(page));
  }, [page]);

  return (
    <div className="mt-16 lg:mt-20">
      <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
        過去の配信
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>視聴</TableHead>
            <TableHead>題名</TableHead>
            {/* <TableHead>大会名</TableHead> */}
            <TableHead>会場</TableHead>
            <TableHead>配信開始日</TableHead>
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
                        <Skeleton hidden={isReady} className="w-5 h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton hidden={isReady} className="w-xs h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton hidden={isReady} className="w-xs h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton hidden={isReady} className="w-xs h-5" />
                      </TableCell>
                    </TableRow>,
                  );
                }
                return <>{rows}</>;
              })()
            : live.map((m) => (
                <Fragment key={m.id}>
                  <TableRow>
                    <TableCell>
                      {m.url !== null && (
                        <Link
                          href={`${m.url}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Play className="size-4" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{m.title}</TableCell>
                    {/* <TableCell>{m.meet && m.meet.title}</TableCell> */}
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
      <hr />
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
              hidden={liveNum <= Number(page) * 10}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
