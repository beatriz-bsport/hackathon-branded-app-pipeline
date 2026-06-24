import type { FC } from "react";

import type { Session } from "@bsport/api-book";
import { Chip } from "@bsport/kaizen-primitive-core";

import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useTranslation } from "#src/utils/i18n";

export const InfoChips: FC<{
  session: Pick<
    Session,
    | "coach"
    | "coach_override"
    | "meta_activity"
    | "establishment"
    | "recurrence_id"
  >;
}> = ({ session }) => {
  const { t } = useTranslation("sessionManagement");
  const { activity } = useRetrieveSessionDetails(session);

  const showGroupActivity = Boolean(session.meta_activity);
  const showRecurring = Boolean(session.recurrence_id);

  if (!showGroupActivity && !showRecurring) return null;

  return (
    <div className="flex flex-wrap items-center gap-xs py-2xs">
      {showGroupActivity && (
        <Chip type="weak" color="default" size="lg" label={activity.name} />
      )}
      {showRecurring && (
        <Chip
          type="weak"
          color="default"
          size="lg"
          iconLeft="refresh-ccw-02"
          label={t("sessionPanel.details.recurring")}
        />
      )}
    </div>
  );
};
