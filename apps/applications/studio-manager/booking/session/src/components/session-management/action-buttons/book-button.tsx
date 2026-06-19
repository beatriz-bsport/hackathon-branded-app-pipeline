import { FC } from "react";

import { Button, Item, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const BookButton: FC<{
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

  const hasAddToWaitlistPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.addToWaitlist"
      : "reservation.activity.allowed_actions.addToWaitlist",
  );

  const hasAnyBookingPermission =
    hasCreateBookingPermission || hasAddToWaitlistPermission;

  if (!session.full || session.group) {
    return (
      <Button
        kind="default"
        iconLeft="plus"
        label={t("bookButton")}
        intent="call-to-action"
        size="md"
        color="main"
        disabled={!hasCreateBookingPermission}
        onClick={() => openModal(SessionManagementModalType.BOOK)}
      />
    );
  }

  const menuItems: Item[] = [
    { type: "title", label: t("classIsFull") },
    ...(hasCreateBookingPermission
      ? [
          {
            id: "book-override",
            type: "button" as const,
            label: t("bookAndOverride"),
            iconLeft: "plus" as const,
            onClick: () => openModal(SessionManagementModalType.BOOK),
          },
        ]
      : []),
    ...(hasAddToWaitlistPermission
      ? [
          {
            id: "add-to-waitlist",
            type: "button" as const,
            label: t("addToWaitlist"),
            iconLeft: "user-plus-01" as const,
            onClick: () =>
              openModal(SessionManagementModalType.ADD_TO_WAITLIST),
          },
        ]
      : []),
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="default"
            iconLeft="chevron-down"
            label={t("bookButton")}
            intent="call-to-action"
            size="md"
            color="main"
            disabled={!hasAnyBookingPermission}
            onClick={() => setIsPopoverOpened(true)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <Menu
            items={menuItems.map((item) =>
              item.type === "button"
                ? {
                    ...item,
                    onClick: () => {
                      setIsPopoverOpened(false);
                      item.onClick?.();
                    },
                  }
                : item,
            )}
          />
        )}
      </Popover.Content>
    </Popover>
  );
};
