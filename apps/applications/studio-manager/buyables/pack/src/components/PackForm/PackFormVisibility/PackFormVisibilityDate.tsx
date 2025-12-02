import React, { useState } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { getToday } from "@bsport/datetime-manipulation";
import { FormField, type UseFormControllerOutput } from "@bsport/form";
import {
  DatePicker,
  type DatePickerProps,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";

type PackFormVisibilityDateProps = {
  fieldIdPrefix: string;
  isDetailsView?: boolean;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackFormVisibilityDate: React.FC<PackFormVisibilityDateProps> = ({
  fieldIdPrefix,
  isDetailsView,
  methods,
}) => {
  const { t, i18n } = useTranslation("details");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const initialExpirationDate =
    methods.formState.defaultValues?.expiration_date;
  const [addExpirationDate, setAddExpirationDate] = useState(
    !!initialExpirationDate,
  );
  // State to remember the latest selected value before closing toggle
  const [expirationDateDraft, setExpirationDateDraft] = useState<
    string | null | undefined
  >(null);

  const today = getToday({ locale: i18n.language, zone: companyTimezone });
  const disablePast = (date: Date) => date < today;

  const statusText = t(
    "formFields.visibilitySection.dateLimitSelector.errorMissingDate",
  );

  return (
    <>
      <Toggle
        checked={addExpirationDate}
        id={`${fieldIdPrefix}-visibility-toggle-add-expiration-date`}
        label={t("formFields.visibilitySection.dateLimitSelector.toggleLabel")}
        onChange={(checked) => {
          if (!checked) {
            // Save the draft value before closing
            setExpirationDateDraft(methods.watch("expiration_date"));
            // Reset to null when closing the toggle
            methods.setValue("expiration_date", null, {
              shouldDirty: true,
            });
          } else {
            // Revert the reset to the latest save data
            methods.setValue("expiration_date", expirationDateDraft, {
              shouldDirty: true,
            });
          }
          setAddExpirationDate(
            typeof checked === "boolean" ? checked : !addExpirationDate,
          );
        }}
      />
      {addExpirationDate && (
        <FormField<PackFormData, "expiration_date", DatePickerProps>
          name="expiration_date"
          mapProps={({ defaultProps, field, form }) => {
            const defaultValue =
              expirationDateDraft ??
              form.formState.defaultValues?.expiration_date;
            return {
              ...defaultProps,
              value: defaultProps.value,
              onSelect: (selectedDate) => {
                const nextValue =
                  selectedDate instanceof Date
                    ? getIsoDateString(selectedDate)
                    : null;

                form.setValue("expiration_date", nextValue, {
                  shouldDirty: true,
                });

                field.onBlur();
              },
              defaultValue: defaultValue ? new Date(defaultValue) : undefined,
              status: defaultProps.value ? undefined : "error",
              statusText: defaultProps.value ? undefined : statusText,
            };
          }}
        >
          <DatePicker
            displayAs="popover"
            id={`${fieldIdPrefix}-visibility-date-picker-expiration-date`}
            mode="single"
            popoverClassNames={{
              container: "ml-[40px]",
            }}
            disableDate={disablePast}
            isInputField
            required={addExpirationDate}
            label={t(
              "formFields.visibilitySection.dateLimitSelector.fieldLabel",
            )}
            popoverPlacement={isDetailsView ? "bottom-right" : "bottom-left"}
          />
        </FormField>
      )}
    </>
  );
};
