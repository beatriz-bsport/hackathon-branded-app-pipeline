import type { FC } from "react";

import type { Session } from "@bsport/api-book";
import { Body, Icon } from "@bsport/kaizen-primitive-core";

import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { LEGACY_URLS } from "#src/urls";

export const EstablishmentRow: FC<{
  session: Pick<
    Session,
    "coach" | "coach_override" | "meta_activity" | "establishment"
  >;
}> = ({ session }) => {
  const { establishment } = useRetrieveSessionDetails(session);

  return (
    <a
      href={LEGACY_URLS.ESTABLISHMENT_DETAILS(establishment.id)}
      className="flex items-center gap-xs text-onsurface-weak hover:underline"
    >
      <Icon icon="pin-02" size="sm" />
      <Body htmlVariant="span" size="md" color="weak">
        {establishment.title}
      </Body>
    </a>
  );
};
