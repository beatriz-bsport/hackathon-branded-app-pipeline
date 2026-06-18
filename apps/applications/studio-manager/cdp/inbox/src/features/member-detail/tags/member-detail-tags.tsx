import { Body, Chip } from "@bsport/kaizen-primitive-core";

import { MemberDetailSection } from "#src/features/member-detail/section/member-detail-section";
import type { MemberDetailTagItem } from "#src/features/member-detail/types";
import { useTranslation } from "#src/utils/i18n";

export type MemberDetailTagsProps = {
  tags: MemberDetailTagItem[];
};

export function MemberDetailTags({ tags }: MemberDetailTagsProps) {
  const { t } = useTranslation("member-detail");

  return (
    <MemberDetailSection title={t("tags")}>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2xs">
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.label}
              type="weak"
              color="default"
              size="sm"
              rounded="lg"
              customColor={tag.color}
            />
          ))}
        </div>
      ) : (
        <Body size="sm" color="weak">
          {t("emptyTags")}
        </Body>
      )}
    </MemberDetailSection>
  );
}
