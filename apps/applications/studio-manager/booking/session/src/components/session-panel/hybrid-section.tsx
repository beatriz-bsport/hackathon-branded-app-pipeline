import type { FC } from "react";

import { Body, Divider, Icon, Title } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details.js";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const HybridSection: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const { getBookingsManagementUrl } = useUrls();
  const { data: session } = useRetrieveSession(sessionId);

  const { activity } = useRetrieveSessionDetails(session);

  if (!session.linked_hybrid_offer_id) return null;

  return (
    <>
      <Divider weight="extra-thin" />
      <section>
        <header className="flex items-center justify-between">
          <Title htmlVariant="h4" weight="strong">
            {t("sessionPanel.hybrid.title")}
          </Title>
          <a
            href={getBookingsManagementUrl(session.linked_hybrid_offer_id)}
            aria-label={
              activity.is_broadcast
                ? t("sessionPanel.hybrid.linkAriaLabelOnline")
                : t("sessionPanel.hybrid.linkAriaLabel")
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="link-external-02" size="sm" />
          </a>
        </header>
        <Body htmlVariant="p" size="lg" weight="weak" className="pt-sm">
          {activity.is_broadcast
            ? t("sessionPanel.hybrid.bodyOnline")
            : t("sessionPanel.hybrid.body")}
        </Body>
      </section>
    </>
  );
};
