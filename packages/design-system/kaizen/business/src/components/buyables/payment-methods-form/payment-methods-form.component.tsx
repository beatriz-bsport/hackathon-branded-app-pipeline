import type { ReactElement } from "react";

import { type FieldValues, FormField } from "@bsport/form";
import {
  Alert,
  Body,
  CheckboxGroup,
  type CheckboxGroupProps,
} from "@bsport/kaizen-primitive-core";

import {
  useKaizenI18nInstance,
  useTranslation,
  withKaizenBusinessI18n,
} from "#src/i18n";
import type { NumberListFieldPath } from "#src/utils/form-types";

import { PAYMENT_METHOD_IDENTIFIERS } from "./constants";

type PaymentMethodsFormProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
} & Partial<CheckboxGroupProps> &
  (
    | {
        /** Whether the buyable is hidden, in order to display an internal status */
        isHidden: true;
        /** Name of the buyable (plural preference) to display in the hidden alert */
        buyableName: string;
      }
    | { isHidden: false; buyableName?: string }
  );

const PaymentMethodsFormInner = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  id,
  fieldName,
  label,
  helperText,
  isHidden,
  buyableName,
  ...additionalProps
}: PaymentMethodsFormProps<TFormValues, TFieldName>): ReactElement => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("buyables", { i18n });

  if (isHidden) {
    return (
      <div>
        <Body htmlVariant="p" size="md">
          {t("paymentMethods.label")}
        </Body>
        <Alert status="info">
          {t("paymentMethods.alertVisibilityHidden", { buyable: buyableName })}
        </Alert>
      </div>
    );
  }

  return (
    <FormField<TFormValues, TFieldName, CheckboxGroupProps>
      name={fieldName}
      mapProps={({ defaultProps, field, form }) => {
        // Convert to a list of string for CheckBoxGroup
        const parsedValue = Array.isArray(field.value)
          ? field.value.map(String)
          : [];

        const setter = (ids: string[]) => {
          form.setValue(
            fieldName,
            ids.map((id) => parseInt(id, 10)) as TFormValues[TFieldName],
            { shouldValidate: true, shouldDirty: true },
          );
        };

        return {
          ...defaultProps,
          checkedIds: parsedValue,
          setCheckedIds: (input: string[] | ((prev: string[]) => string[])) => {
            // Represent a Dispatch<SetStateAction<string[]>>
            if (typeof input === "function") {
              const next = input(parsedValue);
              setter(next);
            } else {
              setter(input);
            }
          },
          value: parsedValue,
          onChange: undefined,
          ref: undefined,
          status: defaultProps.status === "error" ? "critical" : "default",
        };
      }}
    >
      <CheckboxGroup
        id={id}
        label={label ?? t("paymentMethods.label")}
        helperText={helperText ?? t("paymentMethods.helperText")}
        options={[
          {
            id: String(PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID),
            label: t("paymentMethods.options.onlinePayment.label"),
            helperText: t("paymentMethods.options.onlinePayment.helperText"),
          },
          {
            id: String(PAYMENT_METHOD_IDENTIFIERS.ONSITE_PAYMENTS_ID),
            label: t("paymentMethods.options.inPerson.label"),
            helperText: t("paymentMethods.options.inPerson.helperText"),
          },
        ]}
        {...additionalProps}
      />
    </FormField>
  );
};

PaymentMethodsFormInner.displayName = "KaizenPaymentMethodsFormInner";

export const PaymentMethodsForm = withKaizenBusinessI18n(
  PaymentMethodsFormInner,
) as typeof PaymentMethodsFormInner;
