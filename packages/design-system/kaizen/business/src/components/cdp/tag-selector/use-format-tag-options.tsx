import { useMemo } from "react";

import type { Tag, TagGroup } from "@bsport/api-core";
import {
  ColorIndicator,
  type MenuOptionWithColor,
} from "@bsport/kaizen-primitive-core";

/**
 * Aggregate such as in reducers tags and tags groups together in a convenient way
 */
export const useTagAggregations = ({
  tags = [],
  tagGroups = [],
}: {
  tags: Tag[];
  tagGroups: TagGroup[];
}) => {
  const tagIdToTagRecord = useMemo(
    () =>
      tags.reduce(
        (acc, tag) => {
          acc[tag.id] = tag;
          return acc;
        },
        {} as Record<number, Tag>,
      ),
    [tags],
  );

  const tagIdToTagGroupRecord = useMemo(() => {
    const groupIdToGroup = tagGroups.reduce(
      (acc, group) => {
        acc[group.id] = group;
        return acc;
      },
      {} as Record<number, TagGroup>,
    );

    return tags.reduce(
      (acc, tag) => {
        const group = groupIdToGroup[tag.group];
        if (group) {
          acc[tag.id] = group;
        }
        return acc;
      },
      {} as Record<number, TagGroup>,
    );
  }, [tags, tagGroups]);

  return {
    tagIdToTagRecord,
    tagIdToTagGroupRecord,
  };
};

/**
 * Assemble Tags and Tag Groups in a list of grouped Menu Item for the Autocomplete
 */
export const useTagOptions = ({
  tagIdToTagRecord,
  tagGroups,
}: {
  tagIdToTagRecord: Record<number, Tag>;
  tagGroups: TagGroup[];
}): Array<{ title: string; options: Array<MenuOptionWithColor> }> => {
  return useMemo(() => {
    return tagGroups.map((tagGroup) => {
      return {
        title: tagGroup.name,
        options: tagGroup.tags
          .map((tagId) => {
            const tag = tagIdToTagRecord[tagId];

            if (!tag) return null;

            return {
              id: String(tag.id),
              label: tag.name,
              rightSlot: (
                <ColorIndicator color={tag.color} size="sm" type="block" />
              ),
              customColor: tag.color,
            };
          })
          .filter((tag) => !!tag),
      };
    });
  }, [tagIdToTagRecord, tagGroups]);
};
