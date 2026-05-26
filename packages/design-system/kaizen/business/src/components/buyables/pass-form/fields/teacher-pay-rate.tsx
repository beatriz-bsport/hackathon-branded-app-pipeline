import { type ReactElement, useId } from "react";

import { getCurrencyCode } from "@bsport/currency";
import type { FieldValues } from "@bsport/form";
import {
  Body,
  Button,
  Popover,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { FormNumberField } from "#src/components/form/number-field";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { NumberFieldPath } from "#src/utils/form-types";

type PassFormTeacherPayRateProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  id?: string;
  formId?: string;
} & Partial<TextFieldProps>;

export const PassFormTeacherPayRate = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  formId,
  id,
  fieldName,
  ...textFieldProps
}: PassFormTeacherPayRateProps<TFormValues, TFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const finalFormId = `${formId ?? defaultFormId}-teacher-pay-rate`;
  const finalId = id ?? finalFormId;

  return (
    <FormNumberField<TFormValues, TFieldName>
      id={finalId}
      fieldName={fieldName}
      label={t("passForm.teacherPayRate.label")}
      helperText={t("passForm.teacherPayRate.helperText")}
      suffix={{ type: "text", value: getCurrencyCode().toUpperCase() }}
      customNode={
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened, isPopoverOpened }) => (
              <Button
                kind="icon-button"
                icon="info-circle"
                label="Open tooltip"
                size="md"
                intent="flat"
                color="default"
                onClick={() => setIsPopoverOpened(!isPopoverOpened)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content
            placement="bottom-right"
            className="max-w-component-tooltip"
          >
            {() => (
              <Body size="sm">{t("passForm.teacherPayRate.tooltip")}</Body>
            )}
          </Popover.Content>
        </Popover>
      }
      {...textFieldProps}
    />
  );
};

PassFormTeacherPayRate.displayName = "KaizenPassFormTeacherPayRate";
