import { type FC } from "react";

import type { FieldPath, FieldPathByValue } from "@bsport/form";

import type { ClassFormValues, TimeFieldValue } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormNumberFieldFallbackZero } from "./form-number-field-fallback-zero";

export type TimeFieldPath = FieldPathByValue<ClassFormValues, TimeFieldValue>;
type TimeSubFieldPath = FieldPath<ClassFormValues> &
  `${TimeFieldPath}.${keyof TimeFieldValue}`;

interface FormTimeInputRowProps {
  idPrefix: string;
  fieldName: TimeFieldPath;
}

export const FormTimeInputRow: FC<FormTimeInputRowProps> = ({
  idPrefix,
  fieldName,
}) => {
  const { t } = useTranslation("add-edit-form");
  return (
    <div className="flex flex-row gap-xs">
      <FormNumberFieldFallbackZero<ClassFormValues, TimeSubFieldPath>
        fieldName={`${fieldName}.days` as TimeSubFieldPath}
        id={`${idPrefix}-day`}
        prefix={{ type: "text", value: t("addEditForm.timeInput.days") }}
        placeholder="0"
        min={0}
      />
      <FormNumberFieldFallbackZero<ClassFormValues, TimeSubFieldPath>
        fieldName={`${fieldName}.hours` as TimeSubFieldPath}
        id={`${idPrefix}-hour`}
        prefix={{ type: "text", value: t("addEditForm.timeInput.hours") }}
        placeholder="0"
        min={0}
      />
      <FormNumberFieldFallbackZero<ClassFormValues, TimeSubFieldPath>
        fieldName={`${fieldName}.minutes` as TimeSubFieldPath}
        id={`${idPrefix}-minute`}
        prefix={{ type: "text", value: t("addEditForm.timeInput.minutes") }}
        placeholder="0"
        min={0}
      />
    </div>
  );
};
