import { useMemo } from "react";

import type { Tag, TagGroup } from "@bsport/api-cdp/tags";
import {
  ColorIndicator,
  type MenuOptionWithColor,
} from "@bsport/kaizen-primitive-core";

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
