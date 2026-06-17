import { FC } from "react";

import { Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

export const BookButton: FC<{
  sessionId: number;
  openModal: (type: SessionManagementModalType) => void;
}> = ({ sessionId, openModal }) => {
  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);

  if (!session.full || session.group) {
    return (
      <Button
        kind="default"
        iconLeft="plus"
        label={t("bookButton")}
        intent="call-to-action"
        size="md"
        color="main"
        onClick={() => openModal(SessionManagementModalType.BOOK)}
      />
    );
  }

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
            onClick={() => setIsPopoverOpened(true)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <Menu
            items={[
              {
                type: "title",
                label: t("classIsFull"),
              },
              {
                id: "book-override",
                type: "button",
                label: t("bookAndOverride"),
                iconLeft: "plus",
                onClick: () => {
                  setIsPopoverOpened(false);
                  openModal(SessionManagementModalType.BOOK);
                },
              },
              {
                id: "add-to-waitlist",
                type: "button",
                label: t("addToWaitlist"),
                iconLeft: "user-plus-01",
                onClick: () => {
                  setIsPopoverOpened(false);
                  openModal(SessionManagementModalType.ADD_TO_WAITLIST);
                },
              },
            ]}
          />
        )}
      </Popover.Content>
    </Popover>
  );
};
