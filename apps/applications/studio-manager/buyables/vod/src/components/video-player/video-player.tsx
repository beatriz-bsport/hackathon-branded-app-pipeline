import { type FC, useEffect, useRef, useState } from "react";

import { VideoProvider } from "@bsport/api-buyables/video";
import {
  Body,
  Button,
  type IconName,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const VIDEOJS_CSS = "https://vjs.zencdn.net/7.10.2/video-js.css";
const VIDEOJS_JS = "https://vjs.zencdn.net/7.10.2/video.min.js";
const HLS_SOURCE_TYPE = "application/x-mpegURL";

function loadVideojsCDN(onReady: () => void, onError: () => void) {
  if ((window as VideoJsWindow).videojs) {
    onReady();
    return () => {};
  }

  if (!document.querySelector(`link[href="${VIDEOJS_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = VIDEOJS_CSS;
    document.head.appendChild(link);
  }

  let script = document.querySelector<HTMLScriptElement>(
    `script[src="${VIDEOJS_JS}"]`,
  );

  if (!script) {
    script = document.createElement("script");
    script.src = VIDEOJS_JS;
    document.head.appendChild(script);
  }

  let isSettled = false;
  let interval = 0;
  const settle = (callback: () => void) => {
    if (isSettled) {
      return;
    }

    isSettled = true;
    window.clearInterval(interval);
    callback();
  };
  const settleAsReady = () => settle(onReady);
  const settleAsError = () => settle(onError);

  script.addEventListener("load", settleAsReady);
  script.addEventListener("error", settleAsError);

  interval = window.setInterval(() => {
    if ((window as VideoJsWindow).videojs) {
      settleAsReady();
    }
  }, 100);

  return () => {
    window.clearInterval(interval);
    script?.removeEventListener("load", settleAsReady);
    script?.removeEventListener("error", settleAsError);
  };
}

type VideoJsInstance = {
  src: (sources: { src: string; type: string }[]) => void;
  dispose: () => void;
  isDisposed: () => boolean;
};

type VideoJsWindow = Window & {
  videojs?: (
    element: Element,
    options: {
      autoplay: boolean;
      controls: boolean;
      fluid: boolean;
      responsive: boolean;
      preload: string;
      sources: { src: string; type: string }[];
    },
  ) => VideoJsInstance;
};

type VideoJsStatus = "loading" | "ready" | "error";

type VideoPlayerFallbackProps = {
  actionLabel: string;
  description: string;
  iconLeft: IconName;
  href?: string;
};

type VideoJsPlayerProps = {
  errorFallback: Omit<VideoPlayerFallbackProps, "href">;
  src: string;
};

const VideoPlayerFallback: FC<VideoPlayerFallbackProps> = ({
  actionLabel,
  description,
  iconLeft,
  href,
}) => {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-sm rounded-sm bg-surface-default-weaker p-lg text-center">
      <Body htmlVariant="p" size="md" color="default" className="max-w-[420px]">
        {description}
      </Body>
      {href ? (
        <Button
          label={actionLabel}
          intent="default"
          color="main"
          size="md"
          iconLeft={iconLeft}
          onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
        />
      ) : null}
    </div>
  );
};

const VideoJsPlayer: FC<VideoJsPlayerProps> = ({ errorFallback, src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsInstance | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const [status, setStatus] = useState<VideoJsStatus>(() =>
    (window as VideoJsWindow).videojs ? "ready" : "loading",
  );

  useEffect(() => {
    if (status !== "loading") {
      return;
    }

    let isMounted = true;
    const cleanup = loadVideojsCDN(
      () => {
        if (isMounted) {
          setStatus("ready");
        }
      },
      () => {
        if (isMounted) {
          setStatus("error");
        }
      },
    );

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [status]);

  useEffect(() => {
    if (status !== "ready" || !containerRef.current || playerRef.current) {
      return;
    }

    const videojs = (window as VideoJsWindow).videojs;
    if (!videojs) return;

    const videoEl = document.createElement("video-js");
    videoEl.classList.add("vjs-big-play-centered");
    containerRef.current.appendChild(videoEl);

    playerRef.current = videojs(videoEl, {
      autoplay: false,
      controls: true,
      fluid: true,
      responsive: true,
      preload: "auto",
      sources: [{ src, type: HLS_SOURCE_TYPE }],
    });
    currentSrcRef.current = src;

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      currentSrcRef.current = null;
    };
  }, [status]);

  useEffect(() => {
    if (
      status !== "ready" ||
      !playerRef.current ||
      currentSrcRef.current === src
    ) {
      return;
    }

    playerRef.current.src([{ src, type: HLS_SOURCE_TYPE }]);
    currentSrcRef.current = src;
  }, [src, status]);

  if (status === "loading") {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-surface-default-weaker">
        <Loader size="xl" />
      </div>
    );
  }

  if (status === "error") {
    return <VideoPlayerFallback {...errorFallback} href={src} />;
  }

  return <div ref={containerRef} />;
};

type VideoPlayerProps = {
  playbackUrl: string;
  providerIdentifier: VideoProvider;
};

function extractYoutubeId(url: string): string | null {
  try {
    const { hostname, pathname, searchParams } = new URL(url);

    if (hostname.includes("youtube.com")) {
      return searchParams.get("v");
    }

    if (hostname.includes("youtu.be")) {
      return pathname.split("/").filter(Boolean)[0] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  playbackUrl,
  providerIdentifier,
}) => {
  const { t } = useTranslation("collection-details");

  if (providerIdentifier === VideoProvider.YOUTUBE_URL_PROVIDER) {
    const youtubeId = extractYoutubeId(playbackUrl);

    if (!youtubeId) {
      return (
        <VideoPlayerFallback
          actionLabel={t("videoPlayer.actions.openYoutubeVideo")}
          description={t("videoPlayer.fallbacks.youtubeEmbedError")}
          iconLeft="link-external-02"
          href={playbackUrl}
        />
      );
    }

    return (
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (providerIdentifier === VideoProvider.VIMEO_URL_PROVIDER) {
    return (
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://player.vimeo.com/video/${playbackUrl}`}
          title="video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <VideoJsPlayer
      src={playbackUrl}
      errorFallback={{
        actionLabel: t("videoPlayer.actions.openVideo"),
        description: t("videoPlayer.fallbacks.loadError"),
        iconLeft: "link-external-02",
      }}
    />
  );
};
