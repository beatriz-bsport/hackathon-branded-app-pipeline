import { FC } from "react";

import { Button, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

export const RestoreSessionButton: FC<{
  openModal: (type: SessionManagementModalType) => void;
}> = ({ openModal }) => {
  const { t } = useTranslation("sessionList");
  const isMobile = !useMatchMedia("lg");

  const buttonProps = isMobile
    ? ({
        kind: "icon-button",
        icon: "unarchive",
        label: t("table.shortcutActions.restore"),
      } as const)
    : ({
        kind: "default",
        iconLeft: "unarchive",
        label: t("table.shortcutActions.restore"),
      } as const);

  return (
    <Button
      {...buttonProps}
      intent="call-to-action"
      size="md"
      color="main"
      onClick={() => openModal(SessionManagementModalType.RESTORE)}
    />
  );
};
