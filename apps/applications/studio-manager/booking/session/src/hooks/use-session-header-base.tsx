import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import type { Session } from "@bsport/api-book";
import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { MoreActionsButton } from "#src/components/session-management/action-buttons/more-actions-button";
import { SessionNavigationButtons } from "#src/components/session-management/action-buttons/session-navigation-buttons";
import { useRetrieveTeacher } from "#src/hooks/teacher/use-retrieve-teacher";
import type { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

type SessionForHeader = Pick<
  Session,
  "id" | "name_override" | "activity_name" | "coach" | "coach_override"
>;

type Options = {
  openModal: (type: SessionManagementModalType) => void;
};

export const useSessionHeaderBase = (
  session: SessionForHeader,
  { openModal }: Options,
) => {
  const { t } = useTranslation("sessionManagement");
  const queryClient = useQueryClient();
  const isMobile = !useMatchMedia("lg");

  const { data: teacher } = useRetrieveTeacher(
    session.coach_override ?? session.coach,
  );

  const sessionName = session.name_override || session.activity_name;

  const pageTitle = t("pageTitle", {
    sessionName,
    coachName: teacher.name,
  });

  const startGroupActions = useMemo(
    () => [
      <SessionNavigationButtons
        key="session-navigation"
        sessionId={session.id}
      />,
      ...(isMobile
        ? []
        : [
            <ResponsiveTooltip
              key="refresh"
              label={t("refresh")}
              placement="bottom"
            >
              <Button
                kind="icon-button"
                size="md"
                icon="refresh-cw-01"
                intent="default"
                color="main"
                label={t("refresh")}
                onClick={() => queryClient.invalidateQueries()}
              />
            </ResponsiveTooltip>,
          ]),
      <MoreActionsButton
        key="more-actions"
        sessionId={session.id}
        openModal={openModal}
        isMobile={isMobile}
      />,
    ],
    [session.id, openModal, queryClient, t, isMobile],
  );

  return { pageTitle, startGroupActions, isMobile };
};
