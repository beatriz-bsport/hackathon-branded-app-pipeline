import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
} from "react";

import { Item } from "@bsport/kaizen-primitive-core";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const WaitlistActionsButton: FC<{
  sessionId: number;
  openModal: (type: SessionManagementModalType) => void;
}> = ({ sessionId, openModal }) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const { activity } = useRetrieveSessionDetails(session);

  const isWorkshop = activity.is_workshop;

  const hasCreateBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.create"
      : "reservation.activity.allowed_actions.create",
  );

  const getItems = useCallback(
    (setIsPopoverOpened: Dispatch<SetStateAction<boolean>>): Item[] => {
      const bookAllAction: Item = {
        id: "book-all",
        label: t("actions.bookAll"),
        iconLeft: "users-plus",
        type: "button",
        disabled: true, // This action is not yet available, we need to implement the bulk booking creation first
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };

      const pauseWaitlistAction: Item = {
        id: "pause-waitlist",
        label: t("actions.pauseWaitlist"),
        iconLeft: "pause-square",
        type: "button",
        onClick: () => {
          openModal(SessionManagementModalType.PAUSE_WAITLIST);
          setIsPopoverOpened(false);
        },
      };

      return hasCreateBookingPermission
        ? [bookAllAction, pauseWaitlistAction]
        : [pauseWaitlistAction];
    },
    [t, hasCreateBookingPermission, openModal],
  );

  return <ActionsMenuButton label={t("actions.label")} items={getItems} />;
};
