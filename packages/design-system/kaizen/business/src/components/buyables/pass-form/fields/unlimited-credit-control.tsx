import { type ReactElement, useId } from "react";

import { type FieldValues, FormField } from "@bsport/form";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

const OPTION_LIMITED = "limited";
const OPTION_UNLIMITED = "unlimited";

type PassFormUnlimitedCreditControlProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  id?: string;
  formId?: string;
  fieldName: TFieldName;
} & Partial<SegmentedControlProps>;

export const PassFormUnlimitedCreditControl = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  id,
  formId,
  fieldName,
  ...additionalProps
}: PassFormUnlimitedCreditControlProps<
  TFormValues,
  TFieldName
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const options: SegmentedControlProps["options"] = [
    {
      value: OPTION_LIMITED,
      label: t("passForm.unlimitedCreditSelector.optionLimited"),
    },
    {
      value: OPTION_UNLIMITED,
      label: t("passForm.unlimitedCreditSelector.optionUnlimited"),
    },
  ];

  const defaultFormId = useId();
  const finalFormId = `${formId ?? defaultFormId}-unlimited-credit-control`;
  const finalId = id ?? finalFormId;

  return (
    <FormField<TFormValues, TFieldName, SegmentedControlProps>
      name={fieldName}
      mapProps={({ defaultProps }) => {
        const {
          statusText: _,
          onChange,
          value,
          ...otherDefaultProps
        } = defaultProps;
        return {
          ...otherDefaultProps,
          ...(additionalProps ?? {}),
          value: value ? OPTION_UNLIMITED : OPTION_LIMITED,
          onChangeValue: (value: string) =>
            onChange(value === OPTION_UNLIMITED),
        };
      }}
    >
      <SegmentedControl id={finalId} options={options} />
    </FormField>
  );
};

PassFormUnlimitedCreditControl.displayName =
  "KaizenPassFormUnlimitedCreditControl";
