"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ApplyForm } from "@/components/sponsor/apply";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const meets = [
  {
    name: "機関紙「年鑑水泳こうち」",
    date: "5月上旬発刊予定",
    deadline: "3月20日(金)",
    target: "高知県水泳連盟会員",
    place: "",
    option: "",
  },
  {
    name: "日本マスターズ水泳短水路大会 *",
    date: "4月5日(日)",
    deadline: "3月20日(金)",
    target: "成人",
    place: "くろしおアリーナ",
    option: "プランA〜Cは中綴りA4版全ページ掲載となります。",
  },
  {
    name: "第63回高知県春季水泳競技大会",
    date: "4月26日(日)",
    deadline: "3月20日(金)",
    target: "小学生〜成人",
    place: "くろしおアリーナ",
    option: "",
  },
  {
    name: "高知県選手権水泳競技大会",
    date: "7月25日(土)〜26日(日)",
    deadline: "3月20日(金)",
    target: "小学生〜成人",
    place: "くろしおアリーナ",
    option: "",
  },
  {
    name: "第47回高知県学童選手権水泳競技大会",
    date: "8月2日(日)",
    deadline: "3月20日(金)",
    target: "小学生",
    place: "くろしおアリーナ",
    option: "",
  },
  {
    name: "第11回高知県学年別水泳競技大会",
    date: "9月13日(日)",
    deadline: "3月20日(金)",
    target: "小学生〜高校生",
    place: "くろしおアリーナ",
    option: "",
  },
  {
    name: "高知県春季ジュニア水泳競技大会",
    date: "4月5日(日)",
    deadline: "3月20日(金)",
    target: "成人",
    place: "くろしおアリーナ",
    option: "",
  },
];
const pricing = [
  {
    name: "Aプラン",
    id: "a",
    price: "60,000",
    description: "表4(裏表紙)",
    features: ["裏表紙", "A4版一面", "縦260mm×横170mm"],
    featured: true,
  },
  {
    name: "Bプラン",
    id: "b",
    price: "50,000",
    description: "表2(表紙裏)",
    features: ["表紙裏", "A4版一面", "縦260mm×横170mm"],
    featured: false,
  },
  {
    name: "Cプラン",
    id: "c",
    price: "45,000",
    description: "表3(裏表紙裏)",
    features: ["裏表紙表", "A4版一面", "縦260mm×横170mm"],
    featured: false,
  },
  {
    name: "Dプラン",
    id: "d",
    price: "40,000",
    description: "中綴り",
    features: ["中綴り", "A4版一面", "縦260mm×横170mm"],
    featured: false,
  },
  {
    name: "Eプラン",
    id: "e",
    price: "25,000",
    description: "中綴り",
    features: ["中綴り", "A4版1/2", "縦130mm×横170mm"],
    featured: false,
  },
  {
    name: "Fプラン",
    id: "f",
    price: "10,000",
    description: "中綴り",
    features: ["中綴り", "A4版1/4", "縦65mm×横170mm"],
    featured: false,
  },
] as const;

export default function Detail() {
  const [featured, setFeatured] = useState<"a" | "b" | "c" | "d" | "e" | "f">(
    "a",
  );
  return (
    <>
      <form className="pt-24 sm:pt-32">
        <Dialog>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold text-indigo-600">
                令和8年度
              </h2>
              <p className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                広告協賛のご依頼
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl md:text-center indent-[1em] md:indent-0 text-base">
              より良い競技環境の提供と大会運営の充実を図るため、広告協賛を募集します。
            </p>
            <p className="mx-auto mt-2 max-w-2xl md:text-center indent-[1em] md:indent-0 text-base">
              ご協賛いただいた企業様の広告は本連盟主催の大会プログラムに掲載いたします。
            </p>
            <p className="mx-auto mt-2 max-w-2xl md:text-center indent-[1em] md:indent-0 text-base">
              貴社のご協力は、競技者への支援のみならず、地域社会へのスポーツ振興に寄与します。
            </p>
            <p className="mx-auto mt-6 md:text-center text-base">
              <Link href="">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-xs mt-6 text-center"
                >
                  <FileText /> 広告掲載のご依頼 (PDF)
                </Button>
              </Link>
            </p>
            <div className="mt-16 flex justify-center  px-6 lg:px-8 pt-24 sm:pt-32">
              <div className="rounded-full px-4 py-2 text-center text-xs font-semibold inset-ring inset-ring-gray-200">
                年間広告スポンサー料
              </div>
            </div>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-6">
              {pricing.map((item, index) => (
                <div
                  key={item.id}
                  data-featured={item.id === featured ? "true" : undefined}
                  onClick={() => {
                    setFeatured(item.id);
                  }}
                  className="group/tier rounded-3xl p-8 ring-1 ring-gray-200 data-featured:ring-2 data-featured:ring-indigo-600 dark:bg-gray-800/50 dark:ring-white/15 dark:data-featured:ring-indigo-400"
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={`tier-${item.id}`}
                      className="text-lg/8 font-semibold text-gray-900 group-data-featured/tier:text-indigo-600 dark:text-white dark:group-data-featured/tier:text-indigo-400"
                    >
                      {item.name}
                    </h3>
                  </div>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {item.price}
                    </span>
                    <span className="text-sm/6 font-semibold text-gray-600 dark:text-gray-400">
                      円
                    </span>
                  </p>
                  {/* <DialogTrigger asChild>
                    <Link href={"#"} aria-describedby={item.id}> */}
                  <DialogTrigger
                    aria-describedby={item.id}
                    onClick={() => {
                      console.log(item.id);
                      setFeatured(item.id);
                    }}
                    asChild
                  >
                    <Button
                      variant={item.id === featured ? "default" : "outline"}
                      className="mt-6 w-full group-data-featured/tier:bg-indigo-600 group-data-featured/tier:text-white group-data-featured/tier:shadow-xs group-data-featured/tier:inset-ring-0 hover:inset-ring-indigo-300 group-data-featured/tier:hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      申し込む
                    </Button>
                  </DialogTrigger>
                  {/* </Link>
                  </DialogTrigger> */}
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm/6 text-gray-600 dark:text-gray-300"
                  >
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          aria-hidden="true"
                          className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>広告掲載申込</DialogTitle>
                  <DialogDescription>
                    ご協賛ありがとうございます！
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[75vh] w-full">
                  <ApplyForm plan={featured} />
                </ScrollArea>
              </DialogContent>
            </div>
          </div>
        </Dialog>
      </form>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
        <div className="mt-16 flex justify-center">
          <div className="rounded-full px-4 py-2 text-center text-xs font-semibold inset-ring inset-ring-gray-200">
            広告掲載大会
          </div>
        </div>
        <div className="mx-auto max-w-4xl mt-10 ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>大会名</TableHead>
                <TableHead>会場</TableHead>
                <TableHead>開催日</TableHead>
                <TableHead>原稿入稿締切日</TableHead>
                <TableHead>出場選手</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meets.map((meet) => (
                <TableRow key={meet.name}>
                  <TableCell className="font-medium">{meet.name}</TableCell>
                  <TableCell>{meet.place}</TableCell>
                  <TableCell>{meet.date}</TableCell>
                  <TableCell>{meet.deadline}</TableCell>
                  <TableCell>{meet.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  *
                  日本マスターズ水泳短水路大会については、プランA〜Cは中綴りA4版全ページ掲載となります。
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="mx-auto mt-24 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
        <div className="mt-16 flex justify-center">
          <div className="rounded-full px-4 py-2 text-center text-xs font-semibold inset-ring inset-ring-gray-200">
            ご挨拶
          </div>
        </div>
        <div className="relative overflow-hidden mt-10 bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20 dark:bg-black dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:inset-ring dark:after:inset-ring-white/10 dark:after:sm:rounded-3xl">
          <Image
            alt=""
            width={100}
            height={100}
            src="/swim_0.jpg"
            className="absolute inset-0 size-full object-cover brightness-150 saturate-0"
          />
          <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
          <div
            aria-hidden="true"
            className="absolute -top-56 -left-80 transform-gpu blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="aspect-1097/845 w-274.25 bg-linear-to-r from-[#ff4694] to-[#776fff] opacity-[0.45] dark:opacity-[0.30]"
            />
          </div>
          <div
            aria-hidden="true"
            className="hidden md:absolute md:bottom-16 md:left-200 md:block md:transform-gpu md:blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="aspect-1097/845 w-274.25 bg-linear-to-r from-[#ff4694] to-[#776fff] opacity-25 dark:opacity-20"
            />
          </div>
          <div className="relative mx-auto max-w-2xl lg:mx-0">
            <Image
              alt=""
              width={100}
              height={100}
              src="/miura.jpg"
              className="h-24 w-auto rounded-xs"
            />
            <figure>
              <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl/8">
                <p>
                  “本連盟主催の大会には県内全域から水泳愛好者が集まります。どの選手も手に取る大会プログラムに掲載される協賛広告は、貴社の知名度を向上させるだけでなく、貴社が地域貢献活動へ積極的であることもアピールできる良い方法です。高知県の地域スポーツを発展させて、ともに明るい高知県を創っていきましょう。”
                </p>
              </blockquote>
              <figcaption className="mt-6 text-base text-white dark:text-gray-200">
                <div className="font-semibold">三浦 光夫</div>
                <div className="mt-1">高知県水泳連盟会長</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </>
  );
}
