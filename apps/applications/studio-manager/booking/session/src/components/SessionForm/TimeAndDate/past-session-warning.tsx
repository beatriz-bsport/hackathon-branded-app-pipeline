import { FC } from "react";

import { getLocalNow } from "@bsport/datetime-manipulation";
import { useFormContext } from "@bsport/form";
import { Alert, Body } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

/**
 * Warns (without blocking) when the session being created starts in the past.
 * Only rendered in the creation flow — the edit/duplicate flows reuse
 * SessionStartDateTime directly and should not show this warning (BOO-1971).
 */
export const PastSessionWarning: FC = () => {
  const { t } = useTranslation("sessionCreation");

  const { watch, formState } = useFormContext<SessionCreationFormData>();

  const startDateTime = watch("startDateTime");

  // Only warn once the user has set the start themselves: the form default is
  // today 8 AM, which is already in the past for most of the working day.
  if (!formState.dirtyFields.startDateTime) return null;

  // Luxon comparison is instant-based, so no timezone handling is needed here.
  const isInPast = startDateTime != null && startDateTime < getLocalNow({});

  if (!isInPast) return null;

  return (
    <Alert status="warning">
      <Body>
        {t(
          "addSessionModal.steps.configureSession.timeAndDate.pastSessionWarning",
        )}
      </Body>
    </Alert>
  );
};
