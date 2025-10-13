"use client";
import React, { useEffect, useState } from "react";

import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";
import ReactPlayer from "react-player";

import { Skeleton } from "../ui/skeleton";

import { getLiveNow } from "@/lib/live/actions";

export default function Youtube() {
  const [url, setUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getLive = async () => {
    const res = await getLiveNow();
    if (res !== null && res.url !== null) {
      setUrl(res.url);
    }
    setIsReady(true);
  };

  useEffect(() => {
    setIsReady(false);
    getLive();
  }, []);

  return url !== null ? (
    <MediaController
      style={{
        width: "100%",
        aspectRatio: "16/9",
      }}
      hidden={!isReady}
    >
      <ReactPlayer
        slot="media"
        src={url}
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          //   "--controls": "none",
        }}
      ></ReactPlayer>
      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton seekOffset={10} />
        <MediaSeekForwardButton seekOffset={10} />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaPlaybackRateButton />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  ) : (
    <Skeleton hidden={isReady} />
  );
}
