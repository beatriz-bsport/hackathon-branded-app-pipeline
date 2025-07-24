import type { TagState } from "./store";

export const selectTagGroups = (state: TagState) => {
  return state.groups;
};

export const selectTags = (state: TagState) => {
  return state.tags;
};

export const selectTagsByGroupId = (state: TagState, groupId: number) => {
  const { tags } = state;
  return tags.filter((tag) => tag.group === groupId);
};

export const selectTagGroupMappedByTagId = (state: TagState) => {
  const { groups, tags } = state;
  return tags.reduce(
    (acc, tag) => {
      const group = groups.find((group) => group.id === tag.group);
      if (group) {
        acc[tag.id] = group;
      }
      return acc;
    },
    {} as Record<number, (typeof groups)[number]>,
  );
};

export const selectTagMappedByTagId = (state: TagState) => {
  const { tags } = state;
  return tags.reduce(
    (acc, tag) => {
      acc[tag.id] = tag;
      return acc;
    },
    {} as Record<number, (typeof tags)[number]>,
  );
};

export const selectTagById = (state: TagState, tagId: number) => {
  const { tags } = state;
  return tags.find((tag) => tag.id === tagId) || null;
};

export const selectTagUsageMap = (state: TagState) => {
  return state.tagUsageById;
};

export const selectTagUsageById = (state: TagState, tagId: number) => {
  return state.tagUsageById[tagId];
};
