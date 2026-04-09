import { FC } from "react";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveTeacher } from "#src/hooks/teacher/use-retrieve-teacher";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { useTranslation } from "#src/utils/i18n";

export const Header: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const { data: teacher } = useRetrieveTeacher(
    session.coach_override ?? session.coach,
  );

  const headerConfig = useSessionDetailsHeaderConfig(session);

  const sessionName = session.name_override || session.activity_name;

  return (
    <DetailsLayout.Header
      pageTitle={t("pageTitle", {
        sessionName,
        coachName: teacher.name,
      })}
      {...headerConfig}
    />
  );
};
