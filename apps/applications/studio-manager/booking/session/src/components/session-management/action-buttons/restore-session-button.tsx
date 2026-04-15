import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

export const RestoreSessionButton: FC<{
  openModal: (type: SessionManagementModalType) => void;
}> = ({ openModal }) => {
  const { t } = useTranslation("sessionList");
  return (
    <Button
      kind="default"
      iconLeft="unarchive"
      label={t("table.shortcutActions.restore")}
      intent="call-to-action"
      size="md"
      color="main"
      onClick={() => openModal(SessionManagementModalType.RESTORE)}
    />
  );
};
