import { FC, useMemo } from "react";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

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
}> = ({ sessionId, openModal }) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

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
      <MoreActionsButton
        key="more-actions"
        sessionId={session.id}
        openModal={openModal}
      />,
    ];
  }, [session.id, openModal]);

  const endGroupActions = useMemo(() => {
    return [<SendCommunicationButton key="send-communication" />];
  }, []);

  return (
    <DetailsLayout.Header
      pageTitle={t("pageTitle", {
        sessionName,
        coachName: teacher.name,
      })}
      startGroupActions={startGroupActions}
      endGroupActions={endGroupActions}
      onDisplayPopover={() => (
        <div className="flex flex-col gap-sm max-w-[260px]">
          <OrderingBookings />
          <ListedInformationSettings />
        </div>
      )}
      callToActionButton={
        session.available ? (
          <BookButton />
        ) : !session.group ? (
          <RestoreSessionButton openModal={openModal} />
        ) : undefined
      }
      {...headerConfig}
    />
  );
};
