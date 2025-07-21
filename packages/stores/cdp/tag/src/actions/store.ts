import { tagStore } from "#src/store";
import type { Tag, TagGroup, TagUsage } from "#src/types";

export const setTags = ({ tags }: { tags: Tag[] }) => {
  tagStore.setState((state) => {
    const sanitizedTags = tags.filter(Boolean);
    return {
      ...state,
      tags: [...sanitizedTags],
    };
  });
};

export const setSingleTag = ({ tag }: { tag: Tag }) => {
  tagStore.setState((state) => {
    if (!tag) {
      return state;
    }
    const updatedTagList = [...state.tags].filter((t) => t.id !== tag.id);

    return {
      ...state,
      tags: [...updatedTagList, tag],
    };
  });
};

export const deleteTag = ({ id }: { id: number }) => {
  tagStore.setState((state) => {
    const updatedTags = state.tags.filter((tag) => tag.id !== id);
    return {
      ...state,
      tags: updatedTags,
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

export const setSingleTagGroup = ({ group }: { group: TagGroup }) => {
  tagStore.setState((state) => {
    if (!group) {
      return state;
    }
    const updatedGroupList = [...state.groups].filter((g) => g.id !== group.id);

    return {
      ...state,
      groups: [...updatedGroupList, group],
    };
  });
};

export const deleteTagGroup = ({ id }: { id: number }) => {
  tagStore.setState((state) => {
    const updatedGroups = state.groups.filter((group) => group.id !== id);
    return {
      ...state,
      groups: updatedGroups,
    };
  });
};

export const setTagUsages = ({ tagUsages }: { tagUsages: TagUsage[] }) => {
  tagStore.setState((state) => {
    const sanitizedTagUsages = tagUsages.filter(Boolean);
    const tagUsagesByTagId = sanitizedTagUsages.reduce<
      Record<number, TagUsage>
    >((acc, usage) => {
      if (!acc[usage.id]) {
        acc[usage.id] = usage;
      }
      return acc;
    }, {});

    return {
      ...state,
      tagUsageById: tagUsagesByTagId,
    };
  });
};
