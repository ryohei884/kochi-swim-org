"use client";

import { useState, useEffect } from "react";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Image from "next/image";
import Link from "next/link";

import type { newsSchemaType } from "@/lib/news/verification";

import { getList3 } from "@/lib/news/actions";
import { newsLinkCategory } from "@/lib/utils";

export default function News() {
  const [news, setNews] = useState<newsSchemaType[]>([]);

  const getNews = async () => {
    const newsList = await getList3();
    setNews(newsList);
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
            お知らせ
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {news.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <Image
                  alt=""
                  width={256}
                  height={256}
                  src={
                    post.image
                      ? `https://nzprheefai1ubld0.public.blob.vercel-storage.com/${post.image}`
                      : "/soukai.jp"
                  }
                  className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2 dark:bg-gray-800"
                />
                <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
              </div>
              <div className="flex max-w-xl grow flex-col justify-between">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={String(post.revisedAt)}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {format(post.revisedAt, "PPP", { locale: ja })}
                  </time>
                  {post.linkCategory && (
                    <Link
                      href={
                        newsLinkCategory.find((v) => v.id === post.linkCategory)
                          ?.href || "#"
                      }
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {
                        newsLinkCategory.find((v) => v.id === post.linkCategory)
                          ?.name
                      }
                    </Link>
                  )}
                </div>
                <div className="group relative grow">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                    <span className="absolute inset-0" />
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">
                    {post.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
