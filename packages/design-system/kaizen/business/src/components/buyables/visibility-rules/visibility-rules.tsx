import type { ReactElement } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { type FieldValues, FormField } from "@bsport/form";
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

type VisibilityRulesProps<
  TFormValues extends FieldValues,
  BooleanFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  formId: string;
  recommendedField: {
    name: BooleanFieldName | null;
    reversed?: boolean;
  };
  newMembersField: {
    name: BooleanFieldName | null;
    reversed?: boolean;
  };
  hideFromStaffField: {
    name: BooleanFieldName | null;
    reversed?: boolean;
  };
} & Omit<CheckboxProps, "id" | "label" | "Checkboxes" | "options">;

type CheckboxOption<CheckboxFields> = {
  id: string;
  label: string;
  helperText: string;
  field: CheckboxFields;
  reverseBoolean?: boolean;
};

const mapValueToCheckbox = (checked: boolean) =>
  checked ? "checked" : "unchecked";

export const VisibilityRules = <
  TFormValues extends FieldValues,
  BooleanFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  formId,
  recommendedField,
  hideFromStaffField,
  newMembersField,
  ...checkboxProps
}: VisibilityRulesProps<TFormValues, BooleanFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const checkboxOptions: CheckboxOption<BooleanFieldName>[] = [];

  if (recommendedField.name) {
    const recommendedFieldOption = {
      id: "recommended",
      field: recommendedField.name,
      label: t("visibilityRules.checkboxes.recommended.label"),
      helperText: t("visibilityRules.checkboxes.recommended.helperText"),
      reverseBoolean: !!recommendedField?.reversed,
    } as const;
    checkboxOptions.push(recommendedFieldOption);
  }

  if (newMembersField.name) {
    const newMembersFieldOption = {
      id: "new-members-only",
      field: newMembersField.name,
      label: t("visibilityRules.checkboxes.newMembersOnly.label"),
      helperText: t("visibilityRules.checkboxes.newMembersOnly.helperText", {
        minimalCurrency: getCurrencyDisplayWithPrice(0),
      }),
      reverseBoolean: !!newMembersField?.reversed,
    } as const;
    checkboxOptions.push(newMembersFieldOption);
  }

  if (hideFromStaffField.name) {
    const hideFromStaffFieldOption = {
      id: "hide-from-staff",
      field: hideFromStaffField.name,
      label: t("visibilityRules.checkboxes.hideFromStaff.label"),
      helperText: t("visibilityRules.checkboxes.hideFromStaff.helperText"),
      reverseBoolean: !!hideFromStaffField.reversed,
    } as const;
    checkboxOptions.push(hideFromStaffFieldOption);
  }

  const keyBase = `${formId}-visibility-rules-checkbox`;

  return (
    <CheckboxGroup
      id={`${keyBase}-group`}
      label={t("visibilityRules.label")}
      Checkboxes={checkboxOptions.map((config) => {
        const key = `${keyBase}-${config.id}`;
        return (
          <FormField<TFormValues, BooleanFieldName, CheckboxProps>
            name={config.field}
            key={key}
            mapProps={({ defaultProps }) => {
              const {
                value,
                onChange,
                statusText: _,
                ...otherProps
              } = defaultProps;

              if (config.reverseBoolean) {
                return {
                  ...otherProps,
                  value: mapValueToCheckbox(!value),
                  onChange: (value) => {
                    return onChange(!value);
                  },
                };
              }
              return {
                ...otherProps,
                value: mapValueToCheckbox(value),
                onChange,
              };
            }}
          >
            {/** @ts-expect-error value and onChange are provided by the FormField */}
            <Checkbox
              id={key}
              label={config.label}
              helperText={config.helperText}
            />
          </FormField>
        );
      })}
      {...checkboxProps}
    />
  );
};
