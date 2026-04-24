import type { FC } from "react";

import { Chip, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { VideoFormat } from "./types";

type MediaFormatRendererProps = {
  format: VideoFormat;
};

export const MediaFormatRenderer: FC<MediaFormatRendererProps> = ({
  format,
}) => {
  const { t } = useTranslation("media-list");

  if (format === "ebook") {
    return (
      <Tooltip
        label={t("table.tooltips.format.ebookUploaded")}
        placement="bottom"
      >
        <Chip color="default" size="lg" type="weak" iconLeft="book-closed" />
      </Tooltip>
    );
  }

  if (format === "video") {
    return (
      <Tooltip
        label={t("table.tooltips.format.videoUploaded")}
        placement="bottom"
      >
        <Chip color="default" size="lg" type="weak" iconLeft="video-recorder" />
      </Tooltip>
    );
  }

  // format === "none" case
  return (
    <Tooltip
      label={t("table.tooltips.format.noFileUploaded")}
      placement="bottom"
    >
      <Chip
        color="default"
        size="lg"
        type="weak"
        label={t("table.values.noFile")}
      />
    </Tooltip>
  );
};
