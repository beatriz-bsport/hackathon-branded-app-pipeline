import memoize from 'memoize-one';
import { TAG_KIND_MEMBER } from '@bsport/common/master-data/tag.js';
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

export const getTag = (state: RootState, id: string) => state.tag.tag.byId[id];

export const getMemberTagGroups: (state: RootState) => Array<TagGroup> =
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

export const getAllTagsWithTagGroup = createSelector(
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

export const getTagTemplates = (state: RootState) =>
  state.tag.tagTemplate.items;

const _getGroupTemplates = (state: RootState) => state.tag.groupTemplate.items;

export const getTagTemplatesDict = (state: RootState) =>
  state.tag.tagTemplate.byId;

export const getTagGroupTemplatesDict = (state: RootState) =>
  state.tag.group.byId;

export const getTagGroupTemplateList = (state: RootState) =>
  state.tag.groupTemplate.items;

export const getAllTemplate: (state: RootState) => Array<TagGroup> =
  createSelector(
    [getTagTemplates, _getGroupTemplates],
    (tagTemplates, groupTemplates) =>
      [...groupTemplates].map((groupTemplate) => ({
        ...groupTemplate,
        tags: [...tagTemplates].filter(
          (tagTemplate) => tagTemplate.group === groupTemplate.id,
        ),
      })),
  );
