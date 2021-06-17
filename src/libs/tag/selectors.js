// @flow
import memoize from 'memoize-one';
import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import { createSelector } from 'reselect';
import type { State } from '../../state/types';

import type { TagGroup, Tag } from './types';

const _getTags = (state: State) => state.tag.tag.items;
const _getGroups = (state: State) => state.tag.group.items;

export const getTagsDict = (state: State) => state.tag.tag.byId;
export const getTagGroupsDict = (state: State) => state.tag.group.byId;
export const getTagGroupList = (state: State) => state.tag.group.items;
const getAll: (State) => Array<TagGroup> = createSelector(
  [_getTags, _getGroups],
  (tags, groups) =>
    groups.map((g) => ({
      ...g,
      tags: tags.filter((t) => t.group === g.id),
    })),
);

const getMemberTagGroups: (State) => Array<TagGroup> = createSelector(
  getAll,
  (tgs) => tgs.filter((g) => g.kind === TAG_KIND_MEMBER.id),
);

const getMemberTags: (State) => Array<Tag> = createSelector(
  [getMemberTagGroups, _getTags],
  (memberTagGroups, tags) => {
    const tagGroupMemberIds = memberTagGroups.map((tg) => tg.id);
    return tags.filter((tag) => tagGroupMemberIds.includes(tag.group));
  },
);

export const withTags = memoize((selector: (state: State) => any) =>
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
export default { getMemberTagGroups, getMemberTags };
