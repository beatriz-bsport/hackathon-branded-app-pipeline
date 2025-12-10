import { useCallback, useMemo } from "react";

import { useFormContext } from "@bsport/form";

import {
  convertDurationToMinutes,
  convertMinutesToDuration,
} from "#src/utils/duration";

export const useDurationChange = () => {
  const { watch, setValue, formState } = useFormContext();
  const durationMinute = watch("duration_minute");

  const error = formState.errors.duration_minute?.message;

  // Convert total minutes to separate units
  const { days, hours, minutes } = useMemo(
    () => convertMinutesToDuration(durationMinute),
    [durationMinute],
  );

  const handleDurationChange = useCallback(
    (unit: "days" | "hours" | "minutes") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseInt(e.target.value) || 0;

        // Enforce positive values and max constraints
        let value = Math.max(0, rawValue);
        if (unit === "hours") {
          value = Math.min(23, value);
        } else if (unit === "minutes") {
          value = Math.min(59, value);
        }

        // Preserve other units and compute total duration in minutes
        const newDuration = convertDurationToMinutes(
          unit === "days" ? value : days,
          unit === "hours" ? value : hours,
          unit === "minutes" ? value : minutes,
        );

        setValue("duration_minute", newDuration, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
    [days, hours, minutes, setValue],
  );

  return {
    days,
    hours,
    minutes,
    error,
    handleDurationChange,
  };
};
