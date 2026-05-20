import type { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useTranslation } from "#src/utils/i18n";

import { TagGroupBlock } from "./tag-group-block";

export const TagsSection: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);

  const hasAny =
    session.whitelist_tags.length > 0 || session.blacklist_tags.length > 0;
  if (!hasAny) return null;

  return (
    <>
      <Divider weight="extra-thin" />
      <section>
        <Title htmlVariant="h4" weight="strong">
          {t("sessionPanel.tags.title")}
        </Title>
        <div className="flex flex-col gap-md pt-sm">
          <TagGroupBlock
            title={t("sessionPanel.tags.authorised")}
            tagIds={session.whitelist_tags}
          />
          <TagGroupBlock
            title={t("sessionPanel.tags.unauthorised")}
            tagIds={session.blacklist_tags}
          />
        </div>
      </section>
    </>
  );
};
