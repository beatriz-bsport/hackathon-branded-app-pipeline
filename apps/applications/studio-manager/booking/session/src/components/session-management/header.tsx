import { useQueryClient } from "@tanstack/react-query";
import { FC, useMemo } from "react";

import {
  Button,
  DetailsLayout,
  ExpandableSearchInputWithTooltipProps,
  type FilterProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useSessionPageTabs } from "#src/components/session-management/page-tabs";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveTeacher } from "#src/hooks/teacher/use-retrieve-teacher";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

import { BookButton } from "./action-buttons/book-button";
import { MoreActionsButton } from "./action-buttons/more-actions-button";
import { RestoreSessionButton } from "./action-buttons/restore-session-button";
import { SendCommunicationButton } from "./action-buttons/send-communication-button";
import { SessionNavigationButtons } from "./action-buttons/session-navigation-buttons";
import { ListedInformationSettings } from "./filters/listed-information-settings";
import { OrderingBookings } from "./filters/ordering-bookings";

export const Header: FC<{
  sessionId: number;
  openModal: (type: SessionManagementModalType) => void;
  /** Search + display controls only apply to the bookings list, not list tabs. */
  searchConfig?: ExpandableSearchInputWithTooltipProps;
  /** Optional filter bar shown in the header action row (Series tab status). */
  filterConfig?: FilterProps;
  /** List tabs (e.g. Series) hide the bookings-only search and display controls. */
  isListTab?: boolean;
}> = ({ sessionId, openModal, searchConfig, filterConfig, isListTab }) => {
  const { t } = useTranslation("sessionManagement");

  const queryClient = useQueryClient();

  const isMobile = !useMatchMedia("lg");

  const { data: session } = useRetrieveSession(sessionId);

  const pageTabs = useSessionPageTabs(session.id, session.group);

  const { data: teacher } = useRetrieveTeacher(
    session.coach_override ?? session.coach,
  );

  const headerConfig = useSessionDetailsHeaderConfig(session);

  const sessionName = session.name_override || session.activity_name;

  const startGroupActions = useMemo(() => {
    return [
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
    ];
  }, [session.id, openModal, queryClient, t, isMobile]);

  const endGroupActions = useMemo(() => {
    return isMobile
      ? []
      : [<SendCommunicationButton key="send-communication" />];
  }, [isMobile]);

  return (
    <DetailsLayout.Header
      pageTitle={t("pageTitle", {
        sessionName,
        coachName: teacher.name,
      })}
      startGroupActions={startGroupActions}
      endGroupActions={endGroupActions}
      onDisplayPopover={
        isListTab
          ? undefined
          : () => (
              <div className="flex flex-col gap-sm max-w-[260px]">
                <OrderingBookings />
                <ListedInformationSettings />
              </div>
            )
      }
      callToActionButton={
        session.available && !isMobile ? (
          <BookButton
            onClick={() => {
              openModal(SessionManagementModalType.BOOK);
            }}
          />
        ) : !session.group && !isMobile ? (
          <RestoreSessionButton openModal={openModal} />
        ) : undefined
      }
      searchConfig={searchConfig}
      filterConfig={filterConfig}
      {...headerConfig}
      pageTabs={pageTabs}
    />
  );
};
