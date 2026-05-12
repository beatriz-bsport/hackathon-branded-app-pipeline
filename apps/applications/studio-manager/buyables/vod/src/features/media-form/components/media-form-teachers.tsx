import type { FC } from "react";

import { FormField } from "@bsport/form";
import {
  DropdownMultiSelect,
  type DropdownMultiSelectProps,
} from "@bsport/kaizen-primitive-core";

import { useAllTeachersQuery } from "#src/hooks/api/use-all-teachers-query";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

export const MediaFormTeachers: FC = () => {
  const { t } = useTranslation("media-form");
  const { data: teachersById = new Map(), isLoading } = useAllTeachersQuery();

  const teacherOptions = Array.from(teachersById.entries()).map(
    ([id, teacher]) => ({
      id: String(id),
      children: teacher.name,
    }),
  );

  return (
    <FormField<
      MediaFormData,
      "coaches",
      DropdownMultiSelectProps<Record<string, unknown>>
    >
      name="coaches"
      mapProps={({ defaultProps, form }) => ({
        value: (defaultProps.value as number[]).map(String),
        onChange: (values: string[]) => {
          form.setValue("coaches", values.map(Number), {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        options: teacherOptions,
        status: defaultProps.status,
        statusText: defaultProps.statusText,
      })}
    >
      {/** @ts-expect-error value, onChange and options are provided by the wrapper */}
      <DropdownMultiSelect
        label={t("formFields.teachers.label")}
        anchorLabel={t("formFields.teachers.placeholder")}
        mapOptionToChip={(option) => ({
          id: option.id,
          label: option.children?.toString() ?? "",
          color: "default",
          size: "lg",
          type: "weak",
        })}
        isLoading={isLoading}
        className="w-full"
      />
    </FormField>
  );
};
