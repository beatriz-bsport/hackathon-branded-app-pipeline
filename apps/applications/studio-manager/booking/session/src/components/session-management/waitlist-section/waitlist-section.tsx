import { FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useTranslation } from "#src/utils/i18n";

export const WaitlistSection: FC<{
  sessionId: number;
}> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex gap-sm">
        <Title weight="strong" htmlVariant="h3">
          {t("waitlistSectionTitle")}
        </Title>
        <Body size="lg" weight="weak" color="weaker">
          •
        </Body>
        <Body size="lg" weight="weak" color="weaker">
          {t("waitlistSectionSubtitle", {
            bookingOptionsCount: session.booking_options.length,
            waitlistCapacity: session.waiting_list_max_size,
          })}
        </Body>
      </div>
    </div>
  );
};
