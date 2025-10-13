"use client";
import { useState, useEffect, Fragment } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import type { seminarWithUserSchemaType } from "@/lib/seminar/verification";

import { Button } from "@/components/ui/button";
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
import { getList, getListNum } from "@/lib/seminar/actions";

interface Props {
  page: string;
}

type seminarListWithOpenType = seminarWithUserSchemaType & {
  open: boolean;
};
export default function SeminarList(props: Props) {
  const { page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [seminar, setSeminar] = useState<seminarListWithOpenType[]>([]);
  const [seminarNum, setSeminarNum] = useState<number>(0);

  const getSeminar = async (page: number) => {
    const seminarList = await getList(page);
    const seminarListWithOpen = seminarList.map((v) => {
      return { ...v, open: false };
    });
    setSeminar(seminarListWithOpen);
    const seminarListNum = await getListNum();
    setSeminarNum(seminarListNum);
  };

  const handleOpen = (id: string) => {
    const seminarListWithOpen = seminar.map((v) => {
      if (v.id === id) {
        return { ...v, open: !v.open };
      } else {
        return { ...v, open: false };
      }
    });
    setSeminar(seminarListWithOpen);
  };

  useEffect(() => {
    getSeminar(Number(page));
  }, [page]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            講習会情報
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
          <div className="mt-16 space-y-20 lg:mt-20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>開催日</TableHead>
                  <TableHead>講習会名</TableHead>
                  <TableHead>会場</TableHead>
                  <TableHead>詳細</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seminar.map((m) => (
                  <Fragment key={m.id}>
                    <TableRow>
                      <TableCell>
                        {m.fromDate &&
                          format(m.fromDate, "PPP", {
                            locale: ja,
                          })}
                        {m.toDate && "〜"}
                        {m.toDate && format(m.toDate, "M月d日", { locale: ja })}
                      </TableCell>
                      <TableCell>{m.title}</TableCell>
                      <TableCell>{m.place}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpen(m.id)}
                          variant="ghost"
                        >
                          {m.open ? <ChevronsDownUp /> : <ChevronsUpDown />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {m.open && (
                      <TableRow className="bg-accent">
                        <TableCell colSpan={6}>
                          [詳細情報]{m.description}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-16 flex items-center justify-between">
              <PaginationContent className="-mt-px flex w-0 flex-1">
                <PaginationItem className="inline-flex items-center">
                  <PaginationPrevious
                    href={`/seminar/${previousPage}`}
                    hidden={previousPage < 1}
                  />
                </PaginationItem>
                <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                  <PaginationNext
                    href={`/seminar/${nextPage}`}
                    className="inline-flex items-center"
                    hidden={seminarNum <= (Number(page) - 1) * 10}
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
