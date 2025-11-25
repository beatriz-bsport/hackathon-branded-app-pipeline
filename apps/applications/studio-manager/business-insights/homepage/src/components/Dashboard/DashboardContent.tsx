import type { FC } from "react";

import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "./DashboardIframe";

export type DashboardContentProps = {
  errorMessage: string;
  iframeLeftTranslate?: number;
  /** Loading placeholder height (desktop) */
  iframeLoadingHeight: number;
  /** Loading placeholder height (mobile) */
  iframeLoadingMobileHeight?: number;
  iframeTitle: string;
  iframeUrl: string | null;
  isLoading: boolean;
};

const FALLBACK_CONTAINER_CLASSNAME =
  "w-full h-full flex items-center justify-center min-h-[var(--iframe-min-h)]";

export const DashboardContent: FC<DashboardContentProps> = ({
  errorMessage,
  iframeLeftTranslate,
  iframeLoadingHeight,
  iframeLoadingMobileHeight,
  iframeTitle,
  iframeUrl,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        className={FALLBACK_CONTAINER_CLASSNAME}
        style={{ "--iframe-min-h": `${iframeLoadingHeight}px` }}
      >
        <Loader size="xl" />
      </div>
    );
  }

  if (iframeUrl) {
    return (
      <DashboardIframe
        leftTranslate={iframeLeftTranslate}
        loadingHeight={iframeLoadingHeight}
        loadingMobileHeight={iframeLoadingMobileHeight}
        src={iframeUrl}
        title={iframeTitle}
      />
    );
  }

  return (
    <div
      className={FALLBACK_CONTAINER_CLASSNAME}
      style={{ "--iframe-min-h": `${iframeLoadingHeight}px` }}
    >
      <Body color="weak" size="md">
        {errorMessage}
      </Body>
    </div>
  );
};
