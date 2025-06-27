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
