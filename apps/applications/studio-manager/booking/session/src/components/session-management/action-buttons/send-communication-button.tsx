import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip.js";
import { useTranslation } from "#src/utils/i18n.js";

export const SendCommunicationButton: FC = () => {
  const { t } = useTranslation("sessionManagement");
  return (
    <ResponsiveTooltip placement="bottom" label={t("actions.sendMessage")}>
      <Button
        kind="icon-button"
        icon="send-01"
        label=""
        intent="default"
        size="md"
        color="main"
      />
    </ResponsiveTooltip>
  );
};
