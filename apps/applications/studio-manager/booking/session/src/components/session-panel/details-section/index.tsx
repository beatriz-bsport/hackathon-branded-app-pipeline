import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button, Title } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { CreditsRow } from "./credits-row";
import { EstablishmentRow } from "./establishment-row";
import { InfoChips } from "./info-chips";
import { LevelsRow } from "./levels-row";
import { TeacherRow } from "./teacher-row";

export const DetailsSection: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const navigate = useNavigate();
  const { resolveEditPath } = useUrls();
  const { data: session } = useRetrieveSession(sessionId);

  return (
    <section>
      <header className="flex items-center justify-between">
        <Title htmlVariant="h4" weight="strong">
          {t("sessionPanel.details.title")}
        </Title>
        <Button
          kind="icon-button"
          icon="pencil-02"
          size="md"
          intent="flat"
          color="default"
          label={t("sessionPanel.details.editAriaLabel")}
          onClick={() => navigate(resolveEditPath(sessionId))}
        />
      </header>
      <div className="flex flex-col gap-sm pt-sm">
        <TeacherRow session={session} />
        <EstablishmentRow session={session} />
        <LevelsRow level={session.level} />
        <CreditsRow
          credits={session.credit_price_override ?? session.credit_price}
        />
        <InfoChips session={session} />
      </div>
    </section>
  );
};
