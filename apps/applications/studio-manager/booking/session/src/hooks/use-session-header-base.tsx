import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import type { Session } from "@bsport/api-book";
import { Button, toast, useMatchMedia } from "@bsport/kaizen-primitive-core";

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

const TOAST_DURATION = 1000;

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

  const refresh = useCallback(() => {
    queryClient.invalidateQueries();
    toast({
      status: "default",
      title: t("refreshSuccess"),
      duration: TOAST_DURATION,
    });
  }, [queryClient, t]);

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
                onClick={refresh}
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
    [session.id, openModal, t, isMobile, refresh],
  );

  return { pageTitle, startGroupActions };
};
