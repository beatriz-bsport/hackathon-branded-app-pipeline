import type { FC } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  type DateTime,
  calculateDiffDuration,
} from "@bsport/datetime-manipulation";
import { FormField } from "@bsport/form";
import {
  Alert,
  Body,
  DatePicker,
  DatePickerProps,
  Label,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  type ContractPauseFormData,
  FIELD_CONSTRAINTS,
  useDefaultData,
} from "./schema";
import { useDisablePast } from "./utils";

type DatePickerWithAlertProps = {
  errorAlert?: string;
  formId: string;
  value: [DateTime | null, DateTime | null];
  onChange: (nextValue: [DateTime | null, DateTime | null]) => void;
} & Pick<DatePickerProps, "status" | "statusText">;

/**
 * Custom form component to enforce the usage of the latest form value in the Alert.
 * methods.getValues() is "one render behind" and does not allow to use the latest form value.
 */
const DatePickerWithAlert: FC<DatePickerWithAlertProps> = ({
  errorAlert,
  formId,
  onChange,
  status,
  statusText,
  value,
}) => {
  const { t } = useTranslation("contract-features");

  const disablePast = useDisablePast();

  const [fromDate, untilDate] = value;

  const daysDuration =
    fromDate && untilDate
      ? calculateDiffDuration({
          lowerDatetime: fromDate,
          upperDatetime: untilDate,
          units: ["days"],
        }).days + 1
      : 0;

  const daysDurationMessage = t(
    "pauseModal.periodField.description.daysDuration",
    { count: daysDuration },
  );

  const pauseDaterangeInformation = t(
    "pauseModal.periodField.description.body1",
    {
      daysDuration: daysDurationMessage,
      fromDate: fromDate
        ? formatDateTimeFromDate(fromDate, DATETIME_FORMATS.SHORT_DATE)
        : "",
      untilDate: untilDate
        ? formatDateTimeFromDate(untilDate, DATETIME_FORMATS.SHORT_DATE)
        : "",
    },
  );

  return (
    <>
      <div className="flex flex-col gap-2xs">
        <Label label={t("pauseModal.periodField.label")} required />
        <DatePicker
          id={`${formId}-daterange`}
          displayAs="popover"
          mode="range"
          dateValue={value}
          disableDate={disablePast}
          onSelect={(date) => {
            if (Array.isArray(date)) {
              onChange(date);
            }
          }}
        />
        {statusText && (
          <Body size="sm" color={status === "error" ? "critical" : "default"}>
            {statusText}
          </Body>
        )}
      </div>

      {fromDate &&
        untilDate &&
        (errorAlert ? (
          <Alert status="critical" layout="banner" customIcon="alert-circle">
            {errorAlert}
          </Alert>
        ) : (
          <Alert status="info" layout="banner" customIcon="info-circle">
            <p>{pauseDaterangeInformation}</p>
            <ul className="list-disc ml-lg">
              <li>{t("pauseModal.periodField.description.body2")}</li>
              <li>
                {t("pauseModal.periodField.description.body3", {
                  daysDuration: daysDurationMessage,
                })}
              </li>
              <li>{t("pauseModal.periodField.description.body4")}</li>
            </ul>
          </Alert>
        ))}
    </>
  );
};

type ContractPauseFormProps = {
  errorAlert?: string;
  formId: string;
};

export const ContractPauseForm: FC<ContractPauseFormProps> = ({
  errorAlert,
  formId,
}) => {
  const { t } = useTranslation("contract-features");

  const defaultData = useDefaultData();

  return (
    <section className="flex flex-col gap-md">
      <FormField<ContractPauseFormData, "name", TextFieldProps>
        name="name"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          helperText: `${field.value.length}/${FIELD_CONSTRAINTS.NAME_MAX_LENGTH}`,
          onClear: () => {
            form.setValue("name", defaultData.name, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        })}
      >
        <TextField
          id={`${formId}-name`}
          label={t("pauseModal.reasonField.label")}
          required
          fullWidth
        />
      </FormField>

      <FormField<
        ContractPauseFormData,
        "dateRange",
        DatePickerWithAlertProps
      > name="dateRange">
        {/** @ts-expect-error value and onChange are provided by the wrapper */}
        <DatePickerWithAlert errorAlert={errorAlert} formId={formId} />
      </FormField>
    </section>
  );
};
