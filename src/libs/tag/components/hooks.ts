import React from 'react';
import { Tag, TagGroup } from '#libs/tag/types';

// Given a list of tags objects and a list of tag ids, evaluates if at least two tags from the
// tag ids lis belong to the same group.
// Currently used to display an appropriated warning on tag group duplication, since a member should
// never be tagged with two tags from the same group.
export const useHasTagsSameGroup = ({
  selectedTagsIds,
  tagsWithGroup,
}: {
  selectedTagsIds?: Array<number>;
  tagsWithGroup: Array<Tag<TagGroup>>;
}): boolean => {
  const hasTagsSameGroup = React.useMemo(() => {
    const tagsGroup: Array<TagGroup> = [];

    const allTags = selectedTagsIds || [];

    for (let i = 0; i < allTags.length; i += 1) {
      const tagGroup = tagsWithGroup.find(
        (tag) => tag.id === allTags[i],
      )?.group;
      if (tagGroup) {
        if (tagsGroup.includes(tagGroup)) {
          return true;
        }
        tagsGroup.push(tagGroup);
      }
    }
    return false;
  }, [tagsWithGroup, selectedTagsIds]);

  return hasTagsSameGroup;
};
