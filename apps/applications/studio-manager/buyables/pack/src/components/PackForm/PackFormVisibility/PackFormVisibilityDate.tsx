import React, { useState } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { FormField, type UseFormControllerOutput } from "@bsport/form";
import {
  Body,
  DatePicker,
  type DatePickerProps,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";

type PackFormVisibilityDateProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackFormVisibilityDate: React.FC<PackFormVisibilityDateProps> = ({
  fieldIdPrefix,
  methods,
}) => {
  const { t } = useTranslation("details");

  const [addExpirationDate, setAddExpirationDate] = useState(
    !!methods.formState.defaultValues?.expiration_date,
  );
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  const disablePast = (date: Date) => date < today;

  const expirationDate = methods.watch("expiration_date");

  return (
    <>
      <Toggle
        checked={addExpirationDate}
        id={`${fieldIdPrefix}-visibility-toggle-add-expiration-date`}
        label={t("formFields.visibilitySection.dateLimitSelector.toggleLabel")}
        onChange={(checked) => {
          if (!checked) {
            // Reset to null when closing the toggle
            methods.setValue("expiration_date", null, {
              shouldDirty: true,
            });
          }
          setAddExpirationDate(
            typeof checked === "boolean" ? checked : !addExpirationDate,
          );
        }}
      />
      {addExpirationDate && (
        <>
          {/** @todo DatePicker is not a Form component yet, missing required, label and error text */}
          <Body size="md" htmlVariant="p" className="ml-[40px]">
            {t("formFields.visibilitySection.dateLimitSelector.fieldLabel")}
            <Body
              htmlVariant="span"
              size="sm"
              color="critical"
              weight="weak"
              className="ml-2xs"
            >
              *
            </Body>
          </Body>

          <FormField<PackFormData, "expiration_date", DatePickerProps>
            name="expiration_date"
            mapProps={({ defaultProps, field, form }) => ({
              ...defaultProps,
              onClear: () => {
                form.setValue("expiration_date", null, {
                  shouldDirty: true,
                });
                field.onBlur();
              },
              value: defaultProps.value,
              onSelect: (selectedDate) => {
                if (!(selectedDate instanceof Date)) {
                  return;
                }

                form.setValue(
                  "expiration_date",
                  selectedDate ? getIsoDateString(selectedDate) : null,
                  { shouldDirty: true },
                );
              },
              defaultValue: form.formState.defaultValues?.expiration_date
                ? new Date(form.formState.defaultValues?.expiration_date)
                : undefined,
            })}
          >
            <DatePicker
              displayAs="popover"
              id={`${fieldIdPrefix}-visibility-date-picker-expiration-date`}
              mode="single"
              popoverClassNames={{
                container: "ml-[40px]",
              }}
              disableDate={disablePast}
            />
          </FormField>

          {/** @todo DatePicker is not a Form component yet, missing required, label and error text */}
          {!expirationDate && (
            <Body
              color="critical"
              weight="weak"
              size="sm"
              className="ml-[40px]"
            >
              {t(
                "formFields.visibilitySection.dateLimitSelector.errorMissingDate",
              )}
            </Body>
          )}
        </>
      )}
    </>
  );
};
