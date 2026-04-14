import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n.js";

export const RestoreSessionButton: FC = () => {
  const { t } = useTranslation("sessionList");
  return (
    <Button
      kind="default"
      iconLeft="unarchive"
      label={t("table.shortcutActions.restore")}
      intent="call-to-action"
      size="md"
      color="main"
    />
  );
};
