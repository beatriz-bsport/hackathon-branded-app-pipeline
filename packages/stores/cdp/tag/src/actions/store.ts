import { tagStore } from "#src/store";
import type { Tag, TagGroup } from "#src/types";

export const setTags = ({ tags }: { tags: Tag[] }) => {
  tagStore.setState((state) => {
    const sanitizedTags = tags.filter(Boolean);
    return {
      ...state,
      tags: [...sanitizedTags],
    };
  });
};

export const setTagGroups = ({ groups }: { groups: TagGroup[] }) => {
  tagStore.setState((state) => {
    const sanitizedTagGroups = groups.filter(Boolean);
    return {
      ...state,
      groups: [...sanitizedTagGroups],
    };
  });
};
