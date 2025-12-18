import { FC } from "react";

import { useFormContext } from "@bsport/form";

import { Label } from "#src/components/SessionForm/label";
import { RecurrenceType } from "#src/helpers/recurrence/types";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { RecurrenceInterval } from "./interval";
import { RecurrenceUnitSelector } from "./unit-selector";

export const RecurrenceFrequencySelector: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const recurrenceType = watch("recurrenceType");

  if (recurrenceType !== RecurrenceType.CUSTOM) {
    return null;
  }

  return (
    <div className="flex-col gap-2xs flex">
      <Label
        text={t(
          "addSessionModal.steps.configureSession.timeAndDate.recurrence.interval",
        )}
      />
      <div className="flex gap-md">
        <RecurrenceInterval fieldIdPrefix={fieldIdPrefix} />
        <RecurrenceUnitSelector fieldIdPrefix={fieldIdPrefix} />
      </div>
    </div>
  );
};
