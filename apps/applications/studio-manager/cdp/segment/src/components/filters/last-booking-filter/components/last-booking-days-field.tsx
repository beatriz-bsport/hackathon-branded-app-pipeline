import type { ChangeEvent } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { LAST_BOOKING_MIN_VALUE } from "#src/components/filters/last-booking-filter/constants";
import { useTranslation } from "#src/utils/i18n";

type LastBookingDaysFieldProps = {
  id: string;
  value: number | null;
  onChange: (nextValue: number | null) => void;
  errorText?: string;
  disabled?: boolean;
};

const parseDaysInput = (rawValue: string): number | null => {
  if (rawValue.trim() === "") {
    return null;
  }

  const digitsOnly = rawValue.replace(/[^\d]/g, "");
  if (digitsOnly === "") {
    return null;
  }

  const parsed = Number(digitsOnly);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.trunc(parsed);
};

/**
 * Controlled positive-integer TextField for the last-booking lookback window
 * (`value` in days). Allows an empty draft state until the user enters a number.
 */
export const LastBookingDaysField = ({
  id,
  value,
  onChange,
  errorText,
  disabled,
}: LastBookingDaysFieldProps) => {
  const { t } = useTranslation("filters");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseDaysInput(event.target.value));
  };

  return (
    <TextField
      id={id}
      type="number"
      min={LAST_BOOKING_MIN_VALUE}
      step={1}
      value={value === null ? "" : value.toString()}
      onChange={handleChange}
      disabled={disabled}
      status={errorText ? "error" : "default"}
      statusText={errorText}
      label={t("filters.501.fields.daysLabel")}
      suffix={{
        type: "text",
        value: t("filters.501.fields.daysSuffix", { count: value ?? 0 }),
      }}
      fullWidth
    />
  );
};
