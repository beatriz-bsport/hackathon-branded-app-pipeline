import { FC, useId } from "react";

import type { SessionWithActivity } from "@bsport/api-book";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { useRetrieveTeacher } from "#src/hooks/teacher/use-retrieve-teacher.js";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { useTranslation } from "#src/utils/i18n";

import { ShortcutActionsButton } from "../update-session-form/shortcut-actions-button";

export const Header: FC<{
  session: SessionWithActivity;
  onOpenCancelSessionModal: () => void;
  onOpenDuplicateSessionModal: () => void;
  onOpenRestoreSessionModal: () => void;
}> = ({
  session,
  onOpenCancelSessionModal,
  onOpenDuplicateSessionModal,
  onOpenRestoreSessionModal,
}) => {
  const { t } = useTranslation("sessionManagement");

  const headerConfig = useSessionDetailsHeaderConfig(session);

  const { data: teacher } = useRetrieveTeacher(
    session.coach_override ?? session.coach,
  );

  const sessionName = session.name_override || session.name;

  const pageTitle = t("pageTitle", {
    sessionName,
    coachName: teacher.name,
  });

  const key = useId();
  return (
    <DetailsLayout.Header
      pageTitle={pageTitle}
      {...headerConfig}
      endGroupActions={[
        <ShortcutActionsButton
          onOpenCancelSessionModal={onOpenCancelSessionModal}
          onOpenDuplicateSessionModal={onOpenDuplicateSessionModal}
          onOpenRestoreSessionModal={onOpenRestoreSessionModal}
          session={session}
          key={key}
        />,
      ]}
    />
  );
};
