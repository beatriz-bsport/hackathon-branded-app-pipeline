// @flow

import { TAG_KIND_MEMBER } from '@bsport/common/lib/master-data/tag';
import type { State } from '../../state/types';
import type { TagGroup, Tag } from './types';

const _getTags = (state: State) => state.tag.tag.items;
const _getGroups = (state: State) => state.tag.group.items;

const getAll = (state: State): Array<TagGroup> => {
  const tags = _getTags(state);
  const groups = _getGroups(state);
  return groups.map((g) => ({
    ...g,
    tags: tags.filter((t) => t.group === g.id),
  }));
};

const getMemberTagGroups = (state: State): Array<TagGroup> =>
  getAll(state).filter((g) => g.kind === TAG_KIND_MEMBER.id);

const getMemberTags = (state: State): Array<Tag> => {
  const tagGroupMemberIds = getMemberTagGroups(state).map((tg) => tg.id);
  return _getTags(state).filter((tag) => tagGroupMemberIds.includes(tag.group));
};

export default { getMemberTagGroups, getMemberTags };
