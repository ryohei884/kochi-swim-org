import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getLiveNow } from "@/lib/live/actions";
import type { liveWithMeetSchemaType } from "@/lib/live/verification";
import { liveWithMeetSchemaDV } from "@/lib/live/verification";

interface Props {
  pictureURL: string | undefined;
}

export default function Hero(props: Props) {
  const { pictureURL } = props;
  const [live, setLive] = useState<liveWithMeetSchemaType | null>(
    liveWithMeetSchemaDV,
  );
  const [isReady, setIsReady] = useState<boolean>(false);

  const getLive = async () => {
    try {
      const fetchLiveTop = await fetch("/live_active_url");
      const LiveTop = await fetchLiveTop.json();
      if (LiveTop !== false && LiveTop !== undefined) {
        setLive(LiveTop);
      } else {
        setLive(null);
      }
      setIsReady(true);
    } catch (error) {
      const res = await getLiveNow();
      if (res !== null) {
        setLive(res);
      } else {
        setLive(null);
      }
      setIsReady(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(false);
    getLive();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block dark:fill-gray-900"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <div className="hidden sm:mb-10 sm:flex">
                  {live !== null &&
                    live.url !== null &&
                    live.meet !== null &&
                    isReady &&
                    live.meet?.title !== "" && (
                      <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10 dark:hover:ring-white/20">
                        {live.meet?.title}が開催されています。{" "}
                        <Link
                          href="/live"
                          className="font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          ライブ配信へ <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    )}
                </div>
                <div className="flex mb-10 sm:hidden">
                  {live !== null &&
                    live.url !== null &&
                    live.meet !== null &&
                    isReady &&
                    live.meet?.title !== "" && (
                      <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10 dark:hover:ring-white/20">
                        <Link
                          href="/live"
                          className="animate-pulse font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          ライブ配信中 <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    )}
                </div>
                <h1 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
                  高知県水泳連盟
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                  高知県における水泳及び水泳競技の健全なる普及と発展を図るために、選手に向けた競技会や競技力向上活動、指導者や競技役員に向けた各種講習会の開催などを実施しています。
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/greetings"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                  >
                    ご挨拶
                  </Link>
                  <Link
                    href="/overview"
                    className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                  >
                    活動を詳しく知る <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 dark:bg-gray-800">
          {pictureURL !== undefined && (
            <Image
              alt=""
              width={1587}
              height={1190}
              src={pictureURL}
              priority={true}
              className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
