import { FC } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { Label } from "#src/components/SessionForm/label";
import { useDurationChange } from "#src/hooks/useDurationChange";
import { useTranslation } from "#src/utils/i18n";

export const SessionDuration: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { days, error, handleDurationChange, hours, minutes } =
    useDurationChange();

  return (
    <div className="flex flex-col gap-2xs">
      <Label
        text={t(
          "addSessionModal.steps.configureSession.timeAndDate.duration.label",
        )}
      />

      <div className="flex gap-xs items-center">
        {/* Days Input */}
        <div className="w-[120px]">
          <TextField
            value={String(days)}
            id={`${fieldIdPrefix}-duration-days`}
            type="number"
            onChange={handleDurationChange("days")}
            prefix={{
              type: "text",
              value: t(
                "addSessionModal.steps.configureSession.timeAndDate.duration.day",
              ),
            }}
            status={error ? "error" : undefined}
          />
        </div>

        {/* Hours Input */}
        <div className="w-[120px]">
          <TextField
            value={String(hours)}
            id={`${fieldIdPrefix}-duration-hours`}
            type="number"
            onChange={handleDurationChange("hours")}
            prefix={{
              type: "text",
              value: t(
                "addSessionModal.steps.configureSession.timeAndDate.duration.hour",
              ),
            }}
            status={error ? "error" : undefined}
          />
        </div>

        {/* Minutes Input */}
        <div className="w-[120px]">
          <TextField
            value={String(minutes)}
            id={`${fieldIdPrefix}-duration-minutes`}
            type="number"
            onChange={handleDurationChange("minutes")}
            prefix={{
              type: "text",
              value: t(
                "addSessionModal.steps.configureSession.timeAndDate.duration.minute",
              ),
            }}
            status={error ? "error" : undefined}
          />
        </div>
      </div>

      {error && (
        <p
          className={
            "text-body-sm leading-xs text-ellipsis text-onsurface-status-critical-strong"
          }
        >
          {error.toString()}
        </p>
      )}
    </div>
  );
};
