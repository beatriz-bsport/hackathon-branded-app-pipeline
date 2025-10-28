import type { FC } from "react";

import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "./DashboardIframe";

export type DashboardContentProps = {
  errorMessage: string;
  iframeLeftTranslate?: number;
  iframeMinHeight: number;
  iframeTitle: string;
  iframeUrl: string | null;
  isLoading: boolean;
};

const FALLBACK_CONTAINER_CLASSNAME =
  "w-full h-full flex items-center justify-center min-h-[var(--iframe-min-h)]";

export const DashboardContent: FC<DashboardContentProps> = ({
  errorMessage,
  iframeLeftTranslate,
  iframeMinHeight,
  iframeTitle,
  iframeUrl,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        className={FALLBACK_CONTAINER_CLASSNAME}
        style={{ "--iframe-min-h": `${iframeMinHeight}px` }}
      >
        <Loader size="xl" />
      </div>
    );
  }

  if (iframeUrl) {
    return (
      <DashboardIframe
        leftTranslate={iframeLeftTranslate}
        minHeight={iframeMinHeight}
        src={iframeUrl}
        title={iframeTitle}
      />
    );
  }

  return (
    <div
      className={FALLBACK_CONTAINER_CLASSNAME}
      style={{ "--iframe-min-h": `${iframeMinHeight}px` }}
    >
      <Body color="weak" size="md">
        {errorMessage}
      </Body>
    </div>
  );
};
