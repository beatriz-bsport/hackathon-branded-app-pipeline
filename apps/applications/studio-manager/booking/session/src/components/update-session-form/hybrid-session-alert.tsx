import clsx from "clsx";
import { FC } from "react";
import { useNavigate } from "react-router";

import { SessionWithActivity } from "@bsport/api-book";
import {
  Alert,
  Body,
  Button,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const HybridSessionAlert: FC<{ session: SessionWithActivity }> = ({
  session,
}) => {
  const { t } = useTranslation("sessionEdit");

  const navigate = useNavigate();
  const { resolveEditPath } = useUrls();

  const isMobile = !useMatchMedia("sm");

  if (!session.linked_hybrid_offer_id) return null;

  const alertText = session.is_broadcast
    ? t("editSessionForm.content.hybridSessionAlert.broadcastDescription")
    : t("editSessionForm.content.hybridSessionAlert.onSiteDescription");

  const buttonLabel = session.is_broadcast
    ? t("editSessionForm.content.hybridSessionAlert.goToOnsiteSession")
    : t("editSessionForm.content.hybridSessionAlert.goToOnlineSession");

  const goToLinkedSession = () => {
    const linkedSessionId = session.linked_hybrid_offer_id;
    navigate(resolveEditPath(linkedSessionId!));
  };

  return (
    <Alert status="info" className="mb-sm">
      <div
        className={clsx("flex", {
          "flex-col items-start gap-sm": isMobile,
          "flex-row items-center justify-between": !isMobile,
        })}
      >
        <Body htmlVariant="p" size="md" weight="weak" color="info">
          {alertText}
        </Body>
        <Button
          label={buttonLabel}
          intent="default"
          color="main"
          size="sm"
          iconLeft="share-03"
          onClick={goToLinkedSession}
        />
      </div>
    </Alert>
  );
};
