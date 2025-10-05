"use client";
import { useState, useEffect, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { meetKind, poolSize } from "@/lib/utils";
import { getList, getListNum } from "@/lib/meet/actions";
import { meetWithUserSchemaType } from "@/lib/meet/verification";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

interface Props {
  page: string;
}

type meetListWithOpenType = meetWithUserSchemaType & {
  open: boolean;
};
export default function MeetList(props: Props) {
  const { page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [meet, setMeet] = useState<meetListWithOpenType[]>([]);
  const [meetNum, setMeetNum] = useState<number>(0);
  const [kind, setKind] = useState<string>("swimming");

  const getMeet = async (kind: string, page: number) => {
    const kindNum = meetKind.find((v) => v.href === kind)?.id || 0;
    const meetList = await getList(kindNum, page);
    const meetListWithOpen = meetList.map((v) => {
      return { ...v, open: false };
    });
    setMeet(meetListWithOpen);
    const meetListNum = await getListNum(kindNum);
    setMeetNum(meetListNum);
  };

  const handleChange = (e: string) => {
    setKind(e);
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
    getMeet(kind, Number(page));
  }, [kind, page]);
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            競技会情報
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
          <div className="mt-16 space-y-20 lg:mt-20">
            <Tabs
              defaultValue="swimming"
              onValueChange={(e) => handleChange(e)}
            >
              <TabsList>
                <TabsTrigger value="swimming">競泳</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="diving">飛込</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="waterpolo">水球</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="as">AS</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="ow">OW</TabsTrigger>
              </TabsList>
              <TabsContent value={kind}>
                <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
                  {meetKind.find((v) => v.href === kind)?.kind}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>開催日</TableHead>
                      <TableHead>大会名</TableHead>
                      <TableHead>会場</TableHead>
                      <TableHead>水路</TableHead>
                      <TableHead>詳細</TableHead>
                      <TableHead>結果</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meet.map((m) => (
                      <Fragment key={m.id}>
                        <TableRow>
                          <TableCell>
                            {m.fromDate &&
                              format(m.fromDate, "PPP", {
                                locale: ja,
                              })}{" "}
                            〜{" "}
                            {m.toDate &&
                              format(m.toDate, "PPP", { locale: ja })}
                          </TableCell>
                          <TableCell>{m.title}</TableCell>
                          <TableCell>{m.place}</TableCell>
                          <TableCell>
                            {poolSize.find((v) => v.id === m.poolsize)?.size}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleOpen(m.id)}
                              variant="ghost"
                            >
                              {m.open ? <ChevronsDownUp /> : <ChevronsUpDown />}
                            </Button>
                          </TableCell>
                          <TableCell>{m.result ? "有" : "無"}</TableCell>
                        </TableRow>
                        {m.open && (
                          <TableRow className="bg-accent">
                            <TableCell colSpan={6}>test</TableCell>
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
                        href={`/meet/${previousPage}`}
                        hidden={previousPage < 1}
                      />
                    </PaginationItem>
                    <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                      <PaginationNext
                        href={`/meet/${nextPage}`}
                        className="inline-flex items-center"
                        hidden={meetNum <= (Number(page) - 1) * 10}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>
              {/* <TabsContent value="diving">
                Change your password here.
              </TabsContent>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="waterpolo">
                Change your password here.
              </TabsContent>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="as">Change your password here.</TabsContent>
              <TabsContent value="ow">Change your password here.</TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
