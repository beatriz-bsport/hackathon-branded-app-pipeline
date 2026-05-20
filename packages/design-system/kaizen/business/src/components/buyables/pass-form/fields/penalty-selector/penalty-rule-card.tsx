import { Activity, type ReactElement, type ReactNode, useId } from "react";

import { PENALTY_KINDS, type PenaltyKind } from "@bsport/api-buyables";
import { getCurrencyCode } from "@bsport/currency";
import { type FieldValues, FormField, useFormContext } from "@bsport/form";
import {
  Body,
  Card,
  Checkbox,
  type CheckboxProps,
  FormRadioGroup,
  type FormRadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import { FormNumberField } from "#src/components/form/number-field";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath, NumberFieldPath } from "#src/utils/form-types";

const mapValueToCheckbox = (checked: boolean) =>
  checked ? "checked" : "unchecked";

const NUMBER_FIELD_SETTINGS = {
  step: 1,
  maxDigits: 0,
  min: 0,
  className: "max-w-element-3xl",
};

const RADIO_VALUES = {
  BLOCK_PASS: "BLOCK_PASS",
  CHARGE_ACCOUNT: "CHARGE_ACCOUNT",
} as const;

const mapRadioValueToPenaltyKind = (value: string) => {
  if (value === RADIO_VALUES.BLOCK_PASS) {
    return PENALTY_KINDS.BLOCK_PASS;
  }
  if (value === RADIO_VALUES.CHARGE_ACCOUNT) {
    return PENALTY_KINDS.CHARGE_ACCOUNT;
  }
  return null;
};

const mapPenaltyKindToRadioValue = (value: PenaltyKind) => {
  if (value === PENALTY_KINDS.BLOCK_PASS) {
    return RADIO_VALUES.BLOCK_PASS;
  }
  if (value === PENALTY_KINDS.CHARGE_ACCOUNT) {
    return RADIO_VALUES.CHARGE_ACCOUNT;
  }
  return "";
};

type PenaltyRuleCardProps<
  TFormValues extends FieldValues,
  ActiveFieldName extends BooleanFieldPath<TFormValues>,
  NumberFieldNames extends NumberFieldPath<TFormValues>,
> = {
  formId: string;
  title: string;
  description?: ReactNode;
  thresholdLabel: string;
  windowDaysLabel: string;
  activeFieldName: ActiveFieldName;
  thresholdFieldName: NumberFieldNames;
  windowDaysFieldName: NumberFieldNames;
  kindFieldName: NumberFieldNames;
  blockedDaysFieldName: NumberFieldNames;
  accountValueFieldName: NumberFieldNames;
};

export const PenaltyRuleCard = <
  TFormValues extends FieldValues,
  ActiveFieldName extends BooleanFieldPath<TFormValues>,
  NumberFieldNames extends NumberFieldPath<TFormValues>,
>({
  formId,
  title,
  description,
  thresholdLabel,
  windowDaysLabel,
  activeFieldName,
  thresholdFieldName,
  windowDaysFieldName,
  kindFieldName,
  blockedDaysFieldName,
  accountValueFieldName,
}: PenaltyRuleCardProps<
  TFormValues,
  ActiveFieldName,
  NumberFieldNames
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const localId = useId();
  const baseId = `${formId}-${localId}`;
  const activeId = `${baseId}-active`;
  const thresholdId = `${baseId}-threshold`;
  const windowDaysId = `${baseId}-window-days`;
  const kindId = `${baseId}-kind`;
  const blockedDaysId = `${baseId}-blocked-days`;
  const accountValueId = `${baseId}-account-value`;

  const methods = useFormContext<TFormValues>();
  const isActive = methods.watch(activeFieldName);

  return (
    <Card selected elevated padding="none">
      <div className="flex flex-col gap-md bg-surface-action-main-selected-rest p-sm">
        <FormField<TFormValues, ActiveFieldName, CheckboxProps>
          name={activeFieldName}
          mapProps={({ defaultProps }) => {
            const { value, statusText: _, ...otherProps } = defaultProps;
            return {
              ...otherProps,
              value: mapValueToCheckbox(value),
            };
          }}
        >
          {/** @ts-expect-error value and onChange are provided by the FormField */}
          <Checkbox id={activeId} label={title} />
        </FormField>

        <Activity mode={isActive ? "visible" : "hidden"}>
          <div className="flex flex-col gap-sm ml-lg">
            {description}

            <div className="grid grid-cols-2 gap-md">
              <FormNumberField<TFormValues, NumberFieldNames>
                id={thresholdId}
                fieldName={thresholdFieldName}
                label={thresholdLabel}
                fullWidth
                {...NUMBER_FIELD_SETTINGS}
              />
              <FormNumberField<TFormValues, NumberFieldNames>
                id={windowDaysId}
                fieldName={windowDaysFieldName}
                label={windowDaysLabel}
                fullWidth
                {...NUMBER_FIELD_SETTINGS}
              />
            </div>

            <Body weight="strong" size="md">
              {t("passForm.penalty.penaltyKind")}
            </Body>

            <FormField<TFormValues, NumberFieldNames, FormRadioGroupProps>
              name={kindFieldName}
              mapProps={({ defaultProps }) => {
                const {
                  value,
                  onChange,
                  statusText: _,
                  ...otherProps
                } = defaultProps;
                return {
                  ...otherProps,
                  value: mapPenaltyKindToRadioValue(value),
                  onChange: (event) => {
                    onChange(mapRadioValueToPenaltyKind(event.target.value));
                  },
                };
              }}
            >
              <FormRadioGroup
                id={kindId}
                options={[
                  {
                    label: t("passForm.penalty.kindOptions.blockFor"),
                    value: RADIO_VALUES.BLOCK_PASS,
                    element: (
                      <div className="flex flex-row items-center gap-xs">
                        <FormNumberField<TFormValues, NumberFieldNames>
                          id={blockedDaysId}
                          fieldName={blockedDaysFieldName}
                          aria-label={t("passForm.penalty.blockedDaysLabel")}
                          {...NUMBER_FIELD_SETTINGS}
                        />
                        <Body>
                          {t("passForm.penalty.daysSuffix", {
                            count: methods.watch(blockedDaysFieldName),
                          })}
                        </Body>
                      </div>
                    ),
                  },
                  {
                    label: t("passForm.penalty.kindOptions.chargeAccount"),
                    value: RADIO_VALUES.CHARGE_ACCOUNT,
                    element: (
                      <FormNumberField<TFormValues, NumberFieldNames>
                        id={accountValueId}
                        fieldName={accountValueFieldName}
                        aria-label={t("passForm.penalty.accountValueLabel")}
                        {...NUMBER_FIELD_SETTINGS}
                        maxDigits={2}
                        suffix={{
                          type: "text",
                          value: getCurrencyCode().toUpperCase(),
                        }}
                      />
                    ),
                  },
                ]}
              />
            </FormField>
          </div>
        </Activity>
      </div>
    </Card>
  );
};

PenaltyRuleCard.displayName = "KaizenPassFormPenaltyRuleCard";
