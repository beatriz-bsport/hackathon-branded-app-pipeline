import type { ChangeEvent } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { BOOKING_MILESTONE_MIN_VALUE } from "#src/components/filters/booking-milestone/constants";
import { useTranslation } from "#src/utils/i18n";

type BookingMilestoneValueFieldProps = {
  id: string;
  value: number;
  onChange: (nextValue: number) => void;
  errorText?: string;
  disabled?: boolean;
};

const sanitizePositiveInteger = (rawValue: string): number => {
  if (rawValue.trim() === "") {
    return BOOKING_MILESTONE_MIN_VALUE;
  }
  const digitsOnly = rawValue.replace(/[^\d]/g, "");
  if (digitsOnly === "") {
    return BOOKING_MILESTONE_MIN_VALUE;
  }
  const parsed = Number(digitsOnly);
  if (!Number.isFinite(parsed)) {
    return BOOKING_MILESTONE_MIN_VALUE;
  }
  return Math.max(BOOKING_MILESTONE_MIN_VALUE, Math.trunc(parsed));
};

/**
 * Controlled positive-integer TextField for the milestone index (`value >= 1`).
 * Floats and negative values are rejected by sanitization; the displayed value
 * always reflects the parsed integer.
 */
export const BookingMilestoneValueField = ({
  id,
  value,
  onChange,
  errorText,
  disabled,
}: BookingMilestoneValueFieldProps) => {
  const { t } = useTranslation("filters");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(sanitizePositiveInteger(event.target.value));
  };

  return (
    <TextField
      id={id}
      type="number"
      min={BOOKING_MILESTONE_MIN_VALUE}
      step={1}
      value={value.toString()}
      onChange={handleChange}
      disabled={disabled}
      status={errorText ? "error" : "default"}
      statusText={errorText}
      label={t("filters.21.fields.milestoneLabel")}
      suffix={{
        type: "text",
        value: t("filters.21.fields.milestoneSuffix", { count: value }),
      }}
      fullWidth
    />
  );
};
