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
import { getById } from "@/lib/news/actions";
import type { newsSchemaType } from "@/lib/news/verification";
import { newsLinkCategory } from "@/lib/utils";

interface Props {
  id: string;
}

export default function NewsItem(props: Props) {
  const { id } = props;
  const [news, setNews] = useState<newsSchemaType | undefined>(undefined);
  const [nextNewsId, setNextNewsId] = useState<string | undefined>(undefined);
  const [previousNewsId, setPreviousNewsId] = useState<string | undefined>(
    undefined,
  );

  const getNews = async (id: string) => {
    try {
      const news = await getById({ id: id });
      if (news !== null) {
        setNews(news ?? undefined);
      }
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getNews(id);
  }, [id]);

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
            {!news ? (
              <article
                key={"skelton"}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative aspect-3/2 min-w-full lg:min-w-sm lg:shrink-0">
                  <Skeleton className="absolute inset-0 min-w-full lg:min-w-sm rounded-2xl  object-cover dark:bg-gray-800" />
                  <div className="absolute min-w-full lg:min-w-sm inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
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
              </article>
            ) : (
              <div
                key={`post_${news.id}`}
                className="isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative min-w-full lg:min-w-sm aspect-3/2">
                  <Image
                    alt=""
                    width={384}
                    height={(384 / 3) * 2}
                    priority={true}
                    src={news.image ? `${news.image}` : "/logo3-2.svg"}
                    className="min-w-full lg:min-w-sm rounded-2xl bg-gray-100 object-cover aspect-3/2 dark:bg-gray-800"
                  />
                  <div className="absolute inset-0 aspect-3/2 min-w-full lg:min-w-sm lg:shrink-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={String(news.createdAt)}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {format(news.createdAt, "PPP", { locale: ja })}
                    </time>
                    {news.linkCategory && news.linkCategory !== 1 && (
                      <Link
                        href={
                          "/" +
                          (newsLinkCategory.find(
                            (v) => v.id === news.linkCategory,
                          )?.href || "") +
                          "/" +
                          (news.linkString !== null ? news.linkString : "")
                        }
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {
                          newsLinkCategory.find(
                            (v) => v.id === news.linkCategory,
                          )?.name
                        }
                      </Link>
                    )}
                  </div>
                  <div>
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900  dark:text-white">
                      {news.title}
                    </h3>
                    <div className="my-5 text-sm/6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      <ReactMarkdown
                        key={`react_markdown_${news.id}`}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: AnchorTag,
                        }}
                      >
                        {news.detail}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="float-end  mt-16">
            <Link
              href="/news"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              お知らせ一覧 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Pagination className="mt-16 flex items-center justify-between">
            <PaginationContent className="-mt-px flex w-0 flex-1">
              <PaginationItem className="inline-flex items-center">
                <PaginationPrevious
                  href={`/news/id/${previousNewsId}`}
                  hidden={previousNewsId === undefined}
                />
              </PaginationItem>
              <PaginationItem className="-mt-px flex w-0 flex-1 justify-end">
                <PaginationNext
                  href={`/news/id/${nextNewsId}`}
                  className="inline-flex items-center"
                  hidden={nextNewsId === undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
