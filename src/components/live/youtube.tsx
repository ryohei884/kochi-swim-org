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
import { liveWithMeetSchema } from "@/lib/live/verification";

export default function Youtube() {
  const [url, setUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const getLive = async () => {
    try {
      const fetchURL = await fetch("/live_top");
      const URL = await fetchURL.json();

      if (URL !== false && URL !== undefined) {
        const parsedValue = liveWithMeetSchema.safeParse(URL);
        if (parsedValue.success) {
          setUrl(parsedValue.data.url);
        }
      } else {
        setUrl(null);
      }
      setIsReady(true);
    } catch (error) {
      const res = await getLiveNow();
      if (res !== null && res.url !== null) {
        setUrl(res.url);
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
