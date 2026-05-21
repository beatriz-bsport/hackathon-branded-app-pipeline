import type { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { useGroupedTags } from "#src/hooks/tags/use-grouped-tags";

import { TagChip } from "./tag-chip";

export const TagGroupBlock: FC<{ title: string; tagIds: number[] }> = ({
  title,
  tagIds,
}) => {
  const groupedTags = useGroupedTags();

  const items = groupedTags.flatMap((group) =>
    group.tags
      .filter((tag) => tagIds.includes(tag.id))
      .map((tag) => ({ tag, groupName: group.name })),
  );

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-xs">
      <Body htmlVariant="p" size="sm" color="weak" weight="strong">
        {title}
      </Body>
      <div className="flex flex-wrap gap-xs">
        {items.map(({ tag, groupName }) => (
          <TagChip key={tag.id} tag={tag} groupName={groupName} />
        ))}
      </div>
    </div>
  );
};
