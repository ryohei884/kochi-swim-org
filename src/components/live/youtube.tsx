"use client";

import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import { Skeleton } from "@/components/ui/skeleton";
import { getLiveNow } from "@/lib/live/actions";

export default function Youtube() {
  // const [live, setLive] = useState<liveWithMeetSchemaType | null>(
  //   liveWithMeetSchemaDV,
  // );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);

  const getLive = async () => {
    try {
      const fetchLiveTop = await fetch("/live_active_url");
      const LiveTop = await fetchLiveTop.json();
      if (LiveTop !== false && LiveTop.url !== null) {
        setUrl(LiveTop.url);
      } else {
        setUrl(null);
      }
      setIsReady(true);
    } catch (error) {
      const res = await getLiveNow();
      if (res !== null) {
        setUrl(res.url);
      } else {
        setUrl(null);
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
    url !== null && (
      <>
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
        <Skeleton hidden={isReady} />
      </>
    )
  );
}
