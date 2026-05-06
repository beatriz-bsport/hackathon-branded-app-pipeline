import type { FC } from "react";

import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { useLevelsByIdQuery } from "#src/hooks/api/use-levels-by-id-query";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

type MediaFormLevelProps = {
  formId: string;
};

export const MediaFormLevel: FC<MediaFormLevelProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");
  const {
    data: levelsById = new Map<number, { label: string; color: string }>(),
  } = useLevelsByIdQuery();

  const levelOptions = Array.from(levelsById.entries()).map(
    ([id, { label, color }]) => ({ id, label, color }),
  );

  return (
    <FormField<MediaFormData, "level", SelectProps>
      name="level"
      mapProps={({ defaultProps, fieldState, form }) => ({
        ...defaultProps,
        value:
          defaultProps.value == null ? undefined : String(defaultProps.value),
        onChange: (value: string | undefined) => {
          form.setValue("level", value != null ? Number(value) : null, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        status: fieldState.error ? "critical" : "default",
        errorText: fieldState.error?.message,
        items: levelOptions.map((option) => ({
          id: String(option.id),
          label: option.label,
          leftSlot: (
            <span
              className="inline-block h-sm w-sm shrink-0 rounded-2xs"
              style={{ backgroundColor: option.color }}
            />
          ),
        })),
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-level`}
        label={t("formFields.level.label")}
        placeholder={t("formFields.level.placeholder")}
        required
        fullWidth
      />
    </FormField>
  );
};
