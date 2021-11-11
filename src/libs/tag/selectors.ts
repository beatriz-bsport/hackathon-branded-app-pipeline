import memoize from 'memoize-one';
import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import { createSelector } from 'reselect';

import type { TagGroup, Tag, TagGroupAPI } from './types';
import { RootState } from '../../reducers';

const _getTags = (state: RootState) => state.tag.tag.items;
const _getGroups = (state: RootState) => state.tag.group.items;

export const getTagsDict = (state: RootState) => state.tag.tag.byId;
export const getTagGroupsDict = (state: RootState) => state.tag.group.byId;
export const getTagGroupList = (state: RootState) => state.tag.group.items;
export const getAll: (state: RootState) => Array<TagGroup> = createSelector(
  [_getTags, _getGroups],
  (tags, groups) =>
    groups.map((g) => ({
      ...g,
      tags: tags.filter((t) => t.group === g.id),
    })),
);

const getMemberTagGroups: (state: RootState) => Array<TagGroup> =
  createSelector(getAll, (tgs) =>
    tgs.filter((g) => g.kind === TAG_KIND_MEMBER.id),
  );

const getMemberTags: (state: RootState) => Array<Tag> = createSelector(
  [getMemberTagGroups, _getTags],
  (memberTagGroups, tags) => {
    const tagGroupMemberIds = memberTagGroups.map((tg) => tg.id);
    return tags.filter((tag) => tagGroupMemberIds.includes(tag.group));
  },
);

const getMemberTagsWithTagGroup: (state: RootState) => Array<Tag<TagGroupAPI>> =
  createSelector(
    [getMemberTagGroups, _getTags, getTagGroupsDict],
    (memberTagGroups, tags, tagGroupData) => {
      const tagGroupMemberIds = memberTagGroups.map((tg) => tg.id);
      return tags
        .filter((tag) => tagGroupMemberIds.includes(tag.group))
        .map((tag) => ({
          ...tag,
          group: tagGroupData[tag.group],
        }));
    },
  );

export const getallTagsWithTagGroup = createSelector(
  [_getTags, getTagGroupsDict],
  (tagsItemsList, tagGroupData) => {
    return (tagsItemsList || [])
      .map((tag) => {
        return {
          ...tag,
          group: tagGroupData[tag.group],
        };
      })
      .filter((tag) => !!tag.group);
  },
);

export const getMemberTagsIdsList = (state: RootState) =>
  state.tag.marketPlaceMemberTag.tagIdsList;
export const withTags = memoize((selector: (state: RootState) => any) =>
  createSelector([selector, _getTags], (tag_group, tags_list) => {
    if (!tag_group) return null;
    if (!Array.isArray(tag_group)) {
      return {
        ...tag_group,
        tags: tags_list.filter((t) => t.group === tag_group.id),
      };
    }
    return tag_group.map((tg) => ({
      ...tg,
      tags: tags_list.filter((t) => t.group === tg.id),
    }));
  }),
);
export default { getMemberTagGroups, getMemberTags, getMemberTagsWithTagGroup };
