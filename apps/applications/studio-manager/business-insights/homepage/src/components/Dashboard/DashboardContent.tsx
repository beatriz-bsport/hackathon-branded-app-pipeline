import { Activity } from "react";
import type { FC, ReactNode } from "react";

import { Body, Loader, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "./DashboardIframe";

export type DashboardContentProps = {
  errorContent?: ReactNode;
  errorMessage: string;
  iframeLeftTranslate?: number;
  /** Loading placeholder height (desktop) */
  iframeLoadingHeight: number;
  /** Loading placeholder height (mobile) */
  iframeLoadingMobileHeight?: number;
  iframeTitle: string;
  iframeUrl: string | null;
  isError?: boolean;
  isLoading: boolean;
  loadingContent?: ReactNode;
  onSigmaMessage?: (eventData: unknown) => void;
};

const FALLBACK_CONTAINER_CLASSNAME =
  "w-full h-full flex items-center justify-center min-h-[var(--iframe-min-h)]";

export const DashboardContent: FC<DashboardContentProps> = ({
  errorContent,
  errorMessage,
  iframeLeftTranslate,
  iframeLoadingHeight,
  iframeLoadingMobileHeight,
  iframeTitle,
  iframeUrl,
  isError = false,
  isLoading,
  loadingContent,
  onSigmaMessage,
}) => {
  const isMobile = !useMatchMedia("(min-width: 600px)"); // Match Sigma's mobile breakpoint
  const minHeight =
    isMobile && iframeLoadingMobileHeight
      ? iframeLoadingMobileHeight
      : iframeLoadingHeight;
  const minHeightStyle = { "--iframe-min-h": `${minHeight}px` };
  const loadingFallback = loadingContent ?? <Loader size="xl" />;
  const errorFallback = errorContent ?? (
    <Body color="weak" size="md">
      {errorMessage}
    </Body>
  );

  // No URL yet: show loading or error placeholder
  if (!iframeUrl) {
    return (
      <div className={FALLBACK_CONTAINER_CLASSNAME} style={minHeightStyle}>
        {isLoading ? loadingFallback : errorFallback}
      </div>
    );
  }

  // URL available but errored: show error placeholder
  if (isError) {
    return (
      <div className={FALLBACK_CONTAINER_CLASSNAME} style={minHeightStyle}>
        {errorFallback}
      </div>
    );
  }

  // URL available: render iframe, overlaying the loader while it initialises
  return (
    <div
      className={
        isLoading ? "relative w-full min-h-[var(--iframe-min-h)]" : "w-full"
      }
      style={minHeightStyle}
    >
      <Activity mode={isLoading ? "visible" : "hidden"}>
        {loadingFallback}
      </Activity>
      <div
        aria-hidden={isLoading}
        className={
          isLoading
            ? "absolute inset-0 pointer-events-none opacity-0 overflow-hidden"
            : "w-full"
        }
      >
        <DashboardIframe
          leftTranslate={iframeLeftTranslate}
          loadingHeight={iframeLoadingHeight}
          loadingMobileHeight={iframeLoadingMobileHeight}
          onSigmaMessage={onSigmaMessage}
          src={iframeUrl}
          title={iframeTitle}
        />
      </div>
    </div>
  );
};
