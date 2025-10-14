"use client";
import { useState, Fragment } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

import { record } from "@/components/record/record-list";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// type Props = {
//   id: number;
//   poolsize: "長水路" | "短水路";
//   recordType:
//     | "高知県記録"
//     | "高知県大学記録"
//     | "高知県高校記録"
//     | "高知県中学記録"
//     | "高知県学童記録"
//     | "高知県マスターズ記録";
//   sex: "男子" | "女子" | "混合";
//   style:
//     | "自由形"
//     | "背泳ぎ"
//     | "平泳ぎ"
//     | "バタフライ"
//     | "個人メドレー"
//     | "フリーリレー"
//     | "メドレーリレー";
//   distance: number;
//   time: number;
//   name: string;
//   team: string;
//   pool: string;
//   date: string;
//   meet: string;
// }[];

export default function RecordList() {
  const [poolsize, setPoolsize] = useState<string>("長水路");
  const [type, setType] = useState<string>("高知県記録");
  const [sex, setSex] = useState<string>("男子");

  const handlePoolsizeChange = (e: string) => {
    setPoolsize(e);
  };

  const handleTypeChange = (e: string) => {
    setType(e);
  };

  const handleSexChange = (e: string) => {
    setSex(e);
  };

  function getTime(time: number) {
    if (time > 6000) {
      const minute = Math.floor(time / 6000);
      const second = Math.floor((time - minute * 6000) / 100);
      const msec = Math.floor(time - minute * 6000 - second * 100);
      return `${minute}:${("00" + second).slice(-2)}:${("00" + msec).slice(
        -2,
      )}`;
    } else {
      const second = Math.floor(time / 100);
      const msec = Math.floor(time - second * 100);
      return `${second}:${("00" + msec).slice(-2)}`;
    }
  }
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            県記録
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
          <div className="mt-16 space-y-20 lg:mt-20">
            <Tabs
              defaultValue="長水路"
              onValueChange={(e) => handlePoolsizeChange(e)}
            >
              <TabsList>
                <TabsTrigger value="長水路">長水路</TabsTrigger>
                <Separator orientation="vertical" />
                <TabsTrigger value="短水路">短水路</TabsTrigger>
              </TabsList>
              <TabsContent value={poolsize}>
                <Tabs
                  defaultValue="高知県記録"
                  onValueChange={(e) => handleTypeChange(e)}
                >
                  <TabsList>
                    <TabsTrigger value="高知県記録">県</TabsTrigger>
                    <Separator orientation="vertical" />
                    <TabsTrigger value="高知県高校記録">県高校</TabsTrigger>
                    <Separator orientation="vertical" />
                    <TabsTrigger value="高知県中学記録">県中学</TabsTrigger>
                    <Separator orientation="vertical" />
                    <TabsTrigger value="高知県学童記録">県学童</TabsTrigger>
                    <Separator orientation="vertical" />
                  </TabsList>
                  <TabsContent value={type}>
                    <Tabs
                      defaultValue="男子"
                      onValueChange={(e) => handleSexChange(e)}
                    >
                      <TabsList>
                        <TabsTrigger value="男子">男子</TabsTrigger>
                        <Separator orientation="vertical" />
                        <TabsTrigger value="女子">女子</TabsTrigger>
                        <Separator orientation="vertical" />
                        <TabsTrigger value="混合">混合</TabsTrigger>
                      </TabsList>
                      <TabsContent value={sex}>
                        <p className="p-2 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
                          {type} {poolsize} {sex}
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>種目</TableHead>
                              <TableHead>距離</TableHead>
                              <TableHead>タイム</TableHead>
                              <TableHead>選手名</TableHead>
                              <TableHead>所属</TableHead>
                              <TableHead>樹立日</TableHead>
                              <TableHead>会場</TableHead>
                              <TableHead>大会名</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {record
                              .filter(
                                (m) =>
                                  m.category == type &&
                                  m.poolsize == poolsize &&
                                  m.sex == sex,
                              )
                              .map((m) => (
                                <Fragment key={m.id}>
                                  <TableRow>
                                    <TableCell>{m.style}</TableCell>
                                    <TableCell>{m.distance}</TableCell>
                                    <TableCell className="text-right">
                                      {getTime(m.time)}
                                    </TableCell>
                                    <TableCell>
                                      {m.swimmer1} {m.swimmer2}
                                    </TableCell>
                                    <TableCell>{m.team}</TableCell>
                                    <TableCell>
                                      {m.date &&
                                        format(
                                          new Date(String(m.date)),
                                          "PPP",
                                          {
                                            locale: ja,
                                          },
                                        )}
                                    </TableCell>
                                    <TableCell>{m.place}</TableCell>
                                    <TableCell>{m.meet}</TableCell>
                                  </TableRow>
                                </Fragment>
                              ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
