import type { FC } from "react";

import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { useCategoriesByIdQuery } from "#src/hooks/api/use-categories-by-id-query";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

type MediaFormCategoryProps = {
  formId: string;
};

export const MediaFormCategory: FC<MediaFormCategoryProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");
  const { data: categoriesById = new Map<number, string>() } =
    useCategoriesByIdQuery();

  const categoryOptions = Array.from(categoriesById.entries()).map(
    ([id, label]) => ({ id, label }),
  );

  return (
    <FormField<MediaFormData, "category", SelectProps>
      name="category"
      mapProps={({ defaultProps, fieldState, form }) => ({
        ...defaultProps,
        value:
          defaultProps.value == null ? undefined : String(defaultProps.value),
        onChange: (value: string | undefined) => {
          form.setValue("category", value != null ? Number(value) : null, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        status: fieldState.error ? "critical" : "default",
        errorText: fieldState.error?.message,
        items: categoryOptions.map((option) => ({
          id: String(option.id),
          label: option.label,
        })),
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-category`}
        label={t("formFields.category.label")}
        placeholder={t("formFields.category.placeholder")}
        required
        fullWidth
      />
    </FormField>
  );
};
