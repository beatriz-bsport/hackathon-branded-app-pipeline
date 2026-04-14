import { Activity, type ReactElement, useId } from "react";

import { type FieldValues, FormField, useFormContext } from "@bsport/form";
import {
  Checkbox,
  type CheckboxProps,
  type ToggleProps,
} from "@bsport/kaizen-primitive-core";

import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

type PassFormOnDemandToggleProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  enableFieldName: TFieldName;
  restrictFieldName: TFieldName;
  enableId?: string;
  restrictId?: string;
  formId?: string;
  toggleProps?: Partial<ToggleProps>;
  checkboxProps?: Partial<CheckboxProps>;
};

export const PassFormOnDemandToggle = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  formId,
  enableId,
  enableFieldName,
  restrictId,
  restrictFieldName,
  toggleProps = {},
  checkboxProps = {},
}: PassFormOnDemandToggleProps<TFormValues, TFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const enableFormId = `${formId ?? defaultFormId}-on-demand-toggle`;
  const enableFinalId = enableId ?? enableFormId;
  const restrictFormId = `${formId ?? defaultFormId}-on-demand-restrict-checkbox`;
  const restrictFinalId = restrictId ?? restrictFormId;

  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "buyables/on-demand-toggle must be used within a ControlledForm or FormProvider",
    );
  }

  const { watch } = formContext;

  const hasEnableOnDemand = watch(enableFieldName);
  return (
    <div>
      <FormToggle<TFormValues, TFieldName>
        id={enableFinalId}
        fieldName={enableFieldName}
        label={t("passForm.onDemandToggle.label")}
        {...toggleProps}
      />
      <Activity mode={hasEnableOnDemand ? "visible" : "hidden"}>
        <FormField<TFormValues, TFieldName, CheckboxProps>
          name={restrictFieldName}
          mapProps={({ defaultProps }) => {
            const { statusText: _, value, ...otherProps } = defaultProps;
            return {
              ...otherProps,
              ...checkboxProps,
              value: value ? "checked" : "unchecked",
            };
          }}
        >
          {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `checked` props */}
          <Checkbox
            id={restrictFinalId}
            label={t("passForm.onDemandToggle.restrictToOnDemand")}
            className="ml-[40px] mt-xs"
          />
        </FormField>
      </Activity>
    </div>
  );
};

PassFormOnDemandToggle.displayName = "KaizenPassFormOnDemandToggle";
