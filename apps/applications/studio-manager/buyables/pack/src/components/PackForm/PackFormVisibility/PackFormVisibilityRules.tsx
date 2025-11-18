import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { FormField, type UseFormControllerOutput } from "@bsport/form";
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxProps,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { type PackFormSchema } from "../schema";

type PackFormVisibilityRulesProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

type CheckboxFields =
  | "highlighted_as_recommended"
  | "new_member_only"
  | "is_usable_by_staff";

type CheckboxOption = {
  id: string;
  label: string;
  helperText: string;
  field: CheckboxFields;
  reverseBoolean?: boolean;
};

const mapValueToCheckbox = (checked: boolean) =>
  checked ? "checked" : "unchecked";

export const PackFormVisibilityRules: React.FC<
  PackFormVisibilityRulesProps
> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("details");

  const checkboxOptions: CheckboxOption[] = [
    {
      id: "highlighted",
      field: "highlighted_as_recommended",
      label: t(
        "formFields.visibilitySection.additionalRules.checkboxes.recommended.label",
      ),
      helperText: t(
        "formFields.visibilitySection.additionalRules.checkboxes.recommended.helperText",
      ),
    },
    {
      id: "new-members-only",
      field: "new_member_only",
      label: t(
        "formFields.visibilitySection.additionalRules.checkboxes.newMembersOnly.label",
      ),
      helperText: t(
        "formFields.visibilitySection.additionalRules.checkboxes.newMembersOnly.helperText",
        {
          minimalCurrency: getCurrencyDisplayWithPrice(0),
        },
      ),
    },
    {
      id: "hide-from-staff",
      field: "is_usable_by_staff",
      label: t(
        "formFields.visibilitySection.additionalRules.checkboxes.hideFromStaff.label",
      ),
      helperText: t(
        "formFields.visibilitySection.additionalRules.checkboxes.hideFromStaff.helperText",
      ),
      reverseBoolean: true, // Checkbox is "Hide from staff" while field is the opposite (Usable by staff)
    },
  ] as const;

  const keyBase = `${fieldIdPrefix}-visibility-rules-checkbox`;

  return (
    <CheckboxGroup
      id={`${keyBase}-group`}
      label={t("formFields.visibilitySection.additionalRules.label")}
      helperText={t("formFields.visibilitySection.additionalRules.helperText")}
      Checkboxes={checkboxOptions.map((config) => {
        const key = `${keyBase}-${config.id}`;
        return (
          <FormField<PackFormData, CheckboxFields, CheckboxProps>
            name={config.field satisfies keyof PackFormData}
            key={key}
            mapProps={({ defaultProps }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { value, onChange, statusText, ...otherProps } =
                defaultProps;

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
    />
  );
};
