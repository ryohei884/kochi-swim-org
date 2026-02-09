"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getList, getListNum } from "@/lib/news/actions";
import type { newsSchemaType } from "@/lib/news/verification";
import { newsLinkCategory } from "@/lib/utils";

interface Props {
  page: number;
}

export default function NewsList(props: Props) {
  const { page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [news, setNews] = useState<newsSchemaType[]>([]);
  const [newsNum, setNewsNum] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(10);

  const getNews = async (page: number) => {
    if (page === 1) {
      try {
        const fetchURLTop = await fetch("/news_list_top");
        const URLTop = await fetchURLTop.json();
        const response_top = await fetch(`${URLTop}`);

        const fetchURLTopNum = await fetch("/news_list_num");
        const NumTop = await fetchURLTopNum.json();

        if (!response_top.ok) {
          console.log("JSON file doesn't exist.");
          throw new Error(`HTTP error! status: ${response_top.status}`);
        }

        const newsList = await response_top.json();
        setNews(newsList);
        setDataNum(newsList.length);
        setNewsNum(NumTop);
        setIsReady(true);
        console.log(newsList);
      } catch (error) {
        const newsList = await getList(page);
        if (newsList !== null) {
          setNews(newsList);
          setDataNum(newsList.length);
          const newsListNum = await getListNum();
          setNewsNum(newsListNum);
          setIsReady(true);
        }
      }
    } else {
      const newsList = await getList(page);
      if (newsList !== null) {
        setNews(newsList);
        setDataNum(newsList.length);
        const newsListNum = await getListNum();
        setNewsNum(newsListNum);
        setIsReady(true);
      }
    }
  };

  useEffect(() => {
    setIsReady(false);
    getNews(Number(page));
  }, [page]);

  const AnchorTag = ({ node, children, ...props }: any) => {
    try {
      new URL(props.href ?? "");
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    } catch (e) {}
    return (
      <Link {...props} className="flex items-center underline">
        {children}
        <ExternalLink className="h-4 ml-1" />
      </Link>
    );
  };

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            お知らせ
          </h2>
          {/* <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p> */}
          <div className="mt-16 space-y-20 lg:mt-20">
            {!isReady
              ? (function () {
                  const rows = [];
                  for (let i = 0; i < dataNum; i++) {
                    rows.push(
                      <article
                        key={`skelton_${i}`}
                        className="relative isolate flex flex-col gap-8 lg:flex-row"
                      >
                        <div className="relative aspect-3/2 lg:w-64 lg:shrink-0">
                          <Skeleton className="absolute inset-0 size-full rounded-2xl  object-cover dark:bg-gray-800" />
                          <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                        </div>
                        <div>
                          <div className="flex items-center gap-x-4 text-xs">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-24 h-4 relative rounded-full px-3 py-1.5 hover:bg-gray-100 dark:bg-gray-800/60" />
                          </div>
                          <div className="relative max-w-xl">
                            <h3 className="mt-3 text-lg/6 font-semibold">
                              <span className="absolute inset-0" />
                              <Skeleton className="w-120 h-6" />
                            </h3>
                            <Skeleton className="w-80 h-6 mt-5" />
                          </div>
                        </div>
                      </article>,
                    );
                  }
                  return rows;
                })()
              : news.map((post) => (
                  <div
                    key={`post_${post.id}`}
                    className="isolate flex flex-col gap-8 lg:flex-row"
                  >
                    <div className="relative min-w-full lg:min-w-sm aspect-3/2">
                      <Image
                        alt=""
                        width={384}
                        height={(384 / 3) * 2}
                        priority={true}
                        src={post.image ? `${post.image}` : "/logo3-2.svg"}
                        className="min-w-full lg:min-w-sm rounded-2xl bg-gray-100 object-cover aspect-3/2 dark:bg-gray-800"
                      />
                      <div className="absolute inset-0 aspect-3/2 min-w-full lg:min-w-sm lg:shrink-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4 text-xs">
                        <time
                          dateTime={String(post.createdAt)}
                          className="text-gray-500 dark:text-gray-400"
                        >
                          {format(post.createdAt, "PPP", { locale: ja })}
                        </time>
                        {post.linkCategory && (
                          <Link
                            href={
                              "/" +
                              (newsLinkCategory.find(
                                (v) => v.id === post.linkCategory,
                              )?.href || "") +
                              "/" +
                              (post.linkString !== null ? post.linkString : "")
                            }
                            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            {
                              newsLinkCategory.find(
                                (v) => v.id === post.linkCategory,
                              )?.name
                            }
                          </Link>
                        )}
                      </div>
                      <div>
                        <h3 className="mt-3 text-lg/6 font-semibold text-gray-900  dark:text-white">
                          {post.title}
                        </h3>
                        <div className="my-5 text-sm/6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          <ReactMarkdown
                            key={`react_markdown_${post.id}`}
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: AnchorTag,
                            }}
                          >
                            {post.detail}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          <Pagination className="mt-16 flex items-center justify-between">
            <PaginationContent className="-mt-px flex w-0 flex-1">
              <PaginationItem className="inline-flex items-center">
                <PaginationPrevious
                  href={`/news/${previousPage}`}
                  hidden={previousPage < 1}
                />
              </PaginationItem>
              <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                <PaginationNext
                  href={`/news/${nextPage}`}
                  className="inline-flex items-center"
                  hidden={newsNum <= Number(page) * 10}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
