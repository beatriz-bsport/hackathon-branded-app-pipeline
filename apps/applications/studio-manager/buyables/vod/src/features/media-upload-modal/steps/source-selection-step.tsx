import type { FC } from "react";

import { Body, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { UploadSourceType } from "../types";

type SourceSelectionStepProps = {
  value: UploadSourceType | null;
  onChange: (value: UploadSourceType) => void;
  error?: string;
};

const SOURCE_TYPES: UploadSourceType[] = ["youtube", "vimeo", "ebook"];

export const SourceSelectionStep: FC<SourceSelectionStepProps> = ({
  value,
  onChange,
  error,
}) => {
  const { t } = useTranslation("media-list");

  const options = SOURCE_TYPES.map((sourceType) => ({
    value: sourceType,
    label: t(`uploadModal.source.options.${sourceType}.label`),
    helperText: t(`uploadModal.source.options.${sourceType}.helperText`),
  }));

  return (
    <div className="flex w-full flex-col gap-md">
      <RadioGroup
        id="upload-source"
        options={options}
        value={value ?? undefined}
        onChange={(e) => onChange(e.target.value as UploadSourceType)}
      />

      {error && (
        <Body htmlVariant="p" size="sm" color="critical">
          {error}
        </Body>
      )}
    </div>
  );
};
