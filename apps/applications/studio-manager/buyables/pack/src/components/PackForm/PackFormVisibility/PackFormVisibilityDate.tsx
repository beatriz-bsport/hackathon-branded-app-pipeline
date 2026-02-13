import type { FC } from "react";

import { fromIsoString, getIsoDate } from "@bsport/datetime-manipulation";
import { FormField, type UseFormControllerOutput } from "@bsport/form";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";
import {
  DatePicker,
  type DatePickerProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormData, PackFormSchema } from "../schema";
import { useGetDisablePast } from "../utils";

type PackFormVisibilityDateProps = {
  fieldIdPrefix: string;
  isDetailsView?: boolean;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackFormVisibilityDate: FC<PackFormVisibilityDateProps> = ({
  fieldIdPrefix,
  isDetailsView,
  methods,
}) => {
  const { t } = useTranslation("details");

  const hasExpirationDate = methods.watch("hasExpirationDate");

  const disablePast = useGetDisablePast();

  return (
    <>
      <FormToggle<PackFormData, "hasExpirationDate">
        fieldName="hasExpirationDate"
        id={`${fieldIdPrefix}-visibility-toggle-add-expiration-date`}
        label={t("formFields.visibilitySection.dateLimitSelector.toggleLabel")}
      />

      {hasExpirationDate && (
        <FormField<PackFormData, "expiration_date", DatePickerProps>
          name="expiration_date"
          mapProps={({ defaultProps, field, form }) => {
            const defaultValueAsString =
              defaultProps.value ??
              form.formState.defaultValues?.expiration_date;

            const dateValue = defaultValueAsString
              ? fromIsoString(defaultValueAsString)
              : undefined;

            return {
              ...defaultProps,
              onSelect: (selectedDate) => {
                const nextValue =
                  !!selectedDate && !Array.isArray(selectedDate)
                    ? getIsoDate(selectedDate)
                    : null;

                form.setValue("expiration_date", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                field.onBlur();
              },
              defaultValue: dateValue,
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
            required
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
