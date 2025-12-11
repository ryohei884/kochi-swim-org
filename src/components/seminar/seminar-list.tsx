"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
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
import { getList } from "@/lib/seminar/actions";
import type { seminarSchemaType } from "@/lib/seminar/verification";

interface Props {
  year: number;
}

type seminarListWithOpenType = seminarSchemaType & {
  open: boolean;
};
export default function SeminarList(props: Props) {
  const router = useRouter();
  const { year } = props;
  const [seminar, setSeminar] = useState<seminarListWithOpenType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getSeminar = async (year: number) => {
    if (year === 2025) {
      try {
        const fetchURL = await fetch("/seminar_list_top");
        const URL = await fetchURL.json();
        const response = await fetch(`${URL}`);

        if (!response.ok) {
          console.log("JSON file doesn't exist.");
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const seminarList = await response.json();
        const seminarListWithOpen = seminarList.map((v: seminarSchemaType) => {
          return { ...v, open: false };
        });
        setSeminar(seminarListWithOpen);
        setIsReady(true);
      } catch (error) {
        const seminarList = await getList(year);
        const seminarListWithOpen = seminarList.map((v) => {
          return { ...v, open: false };
        });
        setSeminar(seminarListWithOpen);
        setIsReady(true);
      }
    } else {
      const seminarList = await getList(year);
      const seminarListWithOpen = seminarList.map((v) => {
        return { ...v, open: false };
      });
      setSeminar(seminarListWithOpen);
      setIsReady(true);
    }
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

  const handleChange = (e: string) => {
    router.push(`/seminar/${e}`);
    setIsReady(false);
  };

  useEffect(() => {
    getSeminar(year);
  }, [year]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            講習会情報
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
          <div className="mt-16 lg:mt-20">
            <Tabs
              defaultValue={`${year}`}
              onValueChange={(e) => handleChange(e)}
            >
              <TabsList>
                <TabsTrigger value="2025">2025</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="2026">2026</TabsTrigger>
              </TabsList>
              <TabsContent value={`${year}`}>
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
                              </TableRow>,
                            );
                          }
                          return <>{rows}</>;
                        })()
                      : seminar.map((m) => (
                          <Fragment key={m.id}>
                            <TableRow>
                              <TableCell>
                                {m.fromDate &&
                                  format(m.fromDate, "PPP", {
                                    locale: ja,
                                  })}
                                {m.toDate && "〜"}
                                {m.toDate &&
                                  format(m.toDate, "M月d日", { locale: ja })}
                              </TableCell>
                              <TableCell>{m.title}</TableCell>
                              <TableCell>{m.place}</TableCell>
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
                                            v: { value: string; name: string },
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
                                                  {v.name}
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
                                            v: { value: string; name: string },
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
                                                  {v.name}
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
              </TabsContent>
            </Tabs>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}
