import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useSessionNavigation } from "#src/hooks/use-session-navigation";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const SessionNavigationButtons: FC<{ sessionId: number }> = ({
  sessionId,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { nextSessionId, previousSessionId, isLoading } =
    useSessionNavigation(sessionId);

  const { navigateToBookingsManagement, getBookingsManagementPath } = useUrls();

  const isHidden = isLoading || (!nextSessionId && !previousSessionId);

  return (
    <div className={`flex gap-2xs ${isHidden ? "invisible" : ""}`}>
      <ResponsiveTooltip placement="bottom" label={t("goToPreviousSession")}>
        <Button
          kind="icon-button"
          icon="chevron-left"
          label={t("goToPreviousSession")}
          intent="default"
          size="md"
          color="main"
          disabled={!previousSessionId}
          onClick={() =>
            navigateToBookingsManagement(
              getBookingsManagementPath(previousSessionId!),
            )
          }
        />
      </ResponsiveTooltip>
      <ResponsiveTooltip placement="bottom" label={t("goToNextSession")}>
        <Button
          kind="icon-button"
          icon="chevron-right"
          label={t("goToNextSession")}
          intent="default"
          size="md"
          color="main"
          disabled={!nextSessionId}
          onClick={() =>
            navigateToBookingsManagement(
              getBookingsManagementPath(nextSessionId!),
            )
          }
        />
      </ResponsiveTooltip>
    </div>
  );
};
