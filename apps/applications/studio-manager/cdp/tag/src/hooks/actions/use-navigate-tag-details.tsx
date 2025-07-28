import { useEffect, useMemo, useState } from "react";

import type { Tag, TagGroup } from "@bsport/store-cdp-tag";

type UseNavigateTagDetailsProps = {
  tagGroups: TagGroup[];
  tagsMappedByTagId: Record<number, Tag>;
  baseTagId?: number;
};

export const useNavigateTagDetails = ({
  tagGroups,
  tagsMappedByTagId,
  baseTagId,
}: UseNavigateTagDetailsProps) => {
  const [currentInspectedTag, setCurrentInspectedTag] = useState<Tag | null>(
    null,
  );

  const circularListOfTags = useMemo(
    () =>
      tagGroups.reduce<Tag[]>((acc, group) => {
        const groupTags = group.tags.map((tagId) => tagsMappedByTagId[tagId]);
        return [...acc, ...groupTags];
      }, []),
    [tagGroups, tagsMappedByTagId],
  );

  const navigateTagDetails = ({
    direction,
  }: {
    direction: "next" | "previous";
  }) => {
    if (circularListOfTags.length === 0) {
      return;
    }
    const currentIndex = circularListOfTags.findIndex(
      (tag) => tag.id === currentInspectedTag?.id,
    );
    const indexDiff = direction === "next" ? 1 : -1;
    const indexToNavigate =
      (currentIndex + indexDiff + circularListOfTags.length) %
      circularListOfTags.length;
    setCurrentInspectedTag(circularListOfTags[indexToNavigate]);
  };

  useEffect(() => {
    if (currentInspectedTag) {
      setCurrentInspectedTag(tagsMappedByTagId[currentInspectedTag.id] || null);
    }
  }, [tagsMappedByTagId]);

  useEffect(() => {
    if (baseTagId && tagsMappedByTagId) {
      setCurrentInspectedTag(tagsMappedByTagId[baseTagId] || null);
      console.log(`tag data :`, tagsMappedByTagId[baseTagId]);
    }
  }, [baseTagId, tagsMappedByTagId]);

  const navigateToNextTag = () => {
    navigateTagDetails({ direction: "next" });
  };

  const navigateToPreviousTag = () => {
    navigateTagDetails({ direction: "previous" });
  };

  return {
    currentInspectedTag,
    setCurrentInspectedTag,
    navigateToNextTag,
    navigateToPreviousTag,
  };
};
