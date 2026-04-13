import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useSessionNavigation } from "#src/hooks/use-session-navigation.js";
import { useUrls } from "#src/urls.js";
import { useTranslation } from "#src/utils/i18n.js";

export const SessionNavigationButtons: FC<{ sessionId: number }> = ({
  sessionId,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { nextSessionId, previousSessionId, isLoading } =
    useSessionNavigation(sessionId);

  const { navigateToBookingsManagement, getBookingsManagementPath } = useUrls();

  const isHidden = isLoading || (!nextSessionId && !previousSessionId);

  return (
    <div className={`flex gap-xs ${isHidden ? "invisible" : ""}`}>
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
    </div>
  );
};
