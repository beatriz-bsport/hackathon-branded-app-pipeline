import type { FC } from "react";

import { Body, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { UploadSourceType } from "../types";

type YoutubeVimeoStepProps = {
  sourceType: Extract<UploadSourceType, "youtube" | "vimeo">;
  url: string;
  onUrlChange: (value: string) => void;
  urlError?: string;
  hours: number | null;
  onHoursChange: (value: number | null) => void;
  minutes: number | null;
  onMinutesChange: (value: number | null) => void;
  durationError?: string;
};

export const YoutubeVimeoStep: FC<YoutubeVimeoStepProps> = ({
  sourceType,
  url,
  onUrlChange,
  urlError,
  hours,
  onHoursChange,
  minutes,
  onMinutesChange,
  durationError,
}) => {
  const { t } = useTranslation("media-list");

  const parseNumberInput = (raw: string): number | null => {
    const value = parseFloat(raw);
    return Number.isNaN(value) ? null : value;
  };

  return (
    <div className="flex w-full flex-col gap-md">
      <TextField
        id={`upload-video-${sourceType}-url`}
        label={t(`uploadModal.fields.url.${sourceType}`)}
        placeholder={t(`uploadModal.details.${sourceType}.placeholder`)}
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onClear={() => onUrlChange("")}
        status={urlError ? "error" : "default"}
        statusText={urlError}
        required
        fullWidth
      />

      <div className="flex flex-col gap-xs">
        <Body htmlVariant="p" size="md" weight="strong">
          {t("uploadModal.fields.duration")}
        </Body>
        <div className="grid gap-md md:grid-cols-2">
          <TextField
            id="upload-video-hours"
            type="number"
            placeholder={t("uploadModal.fields.hours.placeholder")}
            value={hours == null ? "" : String(hours)}
            onChange={(e) => onHoursChange(parseNumberInput(e.target.value))}
            status={durationError ? "error" : "default"}
            min={0}
            step={1}
            fullWidth
          />
          <TextField
            id="upload-video-minutes"
            type="number"
            placeholder={t("uploadModal.fields.minutes.placeholder")}
            value={minutes == null ? "" : String(minutes)}
            onChange={(e) => onMinutesChange(parseNumberInput(e.target.value))}
            status={durationError ? "error" : "default"}
            min={0}
            step={1}
            fullWidth
          />
        </div>
        {durationError && (
          <Body htmlVariant="p" size="sm" color="critical">
            {durationError}
          </Body>
        )}
      </div>
    </div>
  );
};
