import { useMemo } from "react";

import { buildLocalizedIframeUrl } from "@bsport/api-business-insights/sigma";

import { useTranslation } from "#src/utils/i18n";

interface DashboardIframeProps {
  src: string;
  title: string;
}

/**
 * Reusable iframe component for displaying dashboard content.
 * Ensures consistent iframe configuration across all dashboard pages.
 * Automatically appends the current locale to the Sigma embed URL using `:lng`.
 */
export const DashboardIframe = ({ src, title }: DashboardIframeProps) => {
  const { i18n } = useTranslation();

  const localizedSrc = useMemo(() => {
    return buildLocalizedIframeUrl({
      baseIframeUrl: src,
      language: i18n.language,
    });
  }, [src, i18n.language]);

  return (
    <iframe
      src={localizedSrc}
      className="w-full h-full border-0"
      title={title}
      allowFullScreen
      loading="lazy"
    />
  );
};
