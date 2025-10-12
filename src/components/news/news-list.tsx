"use client";

import { useState, useEffect } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Image from "next/image";
import Link from "next/link";

import type { newsWithUserSchemaType } from "@/lib/news/verification";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getList, getListNum } from "@/lib/news/actions";
import { newsLinkCategory } from "@/lib/utils";

interface Props {
  page: string;
}

export default function NewsList(props: Props) {
  const { page } = props;
  const previousPage = Number(page) - 1;
  const nextPage = Number(page) + 1;
  const [news, setNews] = useState<newsWithUserSchemaType[]>([]);
  const [newsNum, setNewsNum] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(10);

  const getNews = async (page: number) => {
    setIsReady(false);
    const newsList = await getList(page);
    if (newsList !== null) {
      setNews(newsList);
      setDataNum(newsList.length);
      const newsListNum = await getListNum();
      setNewsNum(newsListNum);
      setIsReady(true);
    }
  };

  useEffect(() => {
    getNews(Number(page));
  }, [page]);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            お知らせ
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            詳細は各リンク先からご覧ください。
          </p>
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
                        <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-64 lg:shrink-0">
                          <Skeleton className="absolute inset-0 size-full rounded-2xl  object-cover dark:bg-gray-800" />
                          <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                        </div>
                        <div>
                          <div className="flex items-center gap-x-4 text-xs">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-24 h-4 relative z-10 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:bg-gray-800/60" />
                          </div>
                          <div className="group relative max-w-xl">
                            <h3 className="mt-3 text-lg/6 font-semibold">
                              <span className="absolute inset-0" />
                              <Skeleton className="w-120 h-6" />
                            </h3>
                            <Skeleton className="w-80 h-6 mt-5" />
                          </div>
                        </div>
                      </article>
                    );
                  }
                  return <>{rows}</>;
                })()
              : news.map((post) => (
                  <article
                    key={post.id}
                    className="relative isolate flex flex-col gap-8 lg:flex-row"
                  >
                    <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-64 lg:shrink-0">
                      <Image
                        alt=""
                        width={672}
                        height={336}
                        priority={true}
                        src={post.image ? `${post.image}` : "/logo.svg"}
                        className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover dark:bg-gray-800"
                      />
                      <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4 text-xs">
                        <time
                          dateTime={String(post.revisedAt)}
                          className="text-gray-500 dark:text-gray-400"
                        >
                          {format(post.revisedAt, "PPP", { locale: ja })}
                        </time>
                        {post.linkCategory && (
                          <Link
                            href={
                              "/" +
                              (newsLinkCategory.find(
                                (v) => v.id === post.linkCategory
                              )?.href || "") +
                              "/" +
                              (post.linkString !== null ? post.linkString : "")
                            }
                            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            {
                              newsLinkCategory.find(
                                (v) => v.id === post.linkCategory
                              )?.name
                            }
                          </Link>
                        )}
                      </div>
                      <div className="group relative max-w-xl">
                        <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                          <span className="absolute inset-0" />
                          {post.title}
                        </h3>
                        <p className="my-5 text-sm/6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {post.detail}
                        </p>
                      </div>
                      {post.linkCategory && post.linkString !== null && (
                        <div>
                          <Link
                            href={
                              "/" +
                              (newsLinkCategory.find(
                                (v) => v.id === post.linkCategory
                              )?.href || "") +
                              "/" +
                              post.linkString
                            }
                            className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                            replace
                          >
                            詳細へ <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </article>
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
                  hidden={newsNum <= (Number(page) - 1) * 10}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
