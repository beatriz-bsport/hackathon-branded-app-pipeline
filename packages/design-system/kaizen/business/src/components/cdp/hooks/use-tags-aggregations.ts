import { useMemo } from "react";

import type { Tag, TagGroup } from "@bsport/api-cdp/tags";

export function getTagIdToTagRecord({ tags }: { tags?: Tag[] }) {
  return (tags ?? []).reduce(
    (acc, tag) => {
      acc[tag.id] = tag;
      return acc;
    },
    {} as Record<number, Tag>,
  );
}

export function getTagIdToTagGroupRecord({
  tags,
  tagGroups,
}: {
  tags?: Tag[];
  tagGroups?: TagGroup[];
}) {
  const groupIdToGroup = (tagGroups ?? []).reduce<Record<number, TagGroup>>(
    (acc, group) => {
      acc[group.id] = group;
      return acc;
    },
    {},
  );

  return (tags ?? []).reduce<Record<number, TagGroup>>((acc, tag) => {
    const group = groupIdToGroup[tag.group];
    if (group) {
      acc[tag.id] = group;
    }
    return acc;
  }, {});
}

/**
 * Aggregate such as in reducers tags and tags groups together in a convenient way
 */
export const useTagAggregations = ({
  tags = [],
  tagGroups = [],
}: {
  tags?: Tag[];
  tagGroups?: TagGroup[];
}) => {
  const tagIdToTagRecord = useMemo(() => getTagIdToTagRecord({ tags }), [tags]);

  const tagIdToTagGroupRecord = useMemo(() => {
    getTagIdToTagGroupRecord({ tags, tagGroups });
  }, [tags, tagGroups]);

  return {
    tagIdToTagRecord,
    tagIdToTagGroupRecord,
  };
};
