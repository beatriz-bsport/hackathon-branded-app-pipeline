import { useEffect, useMemo, useState } from "react";

import type { Tag, TagGroup } from "@bsport/store-cdp-tag";

import { TAG_LIST_ITEM_ID } from "#src/utils/constants";

import { useDrawerQueryParam } from "./use-query-param-management";

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
  const { openDrawer } = useDrawerQueryParam();
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

  const scrollScreenIntoNavigatedTag = (tagId: number) => {
    const tagElement = document.getElementById(TAG_LIST_ITEM_ID(tagId));
    if (tagElement) {
      tagElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

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
    const navigatedTag = circularListOfTags[indexToNavigate];
    openDrawer(navigatedTag.id);
    setCurrentInspectedTag(navigatedTag);
    scrollScreenIntoNavigatedTag(navigatedTag.id);
  };

  useEffect(() => {
    if (currentInspectedTag) {
      setCurrentInspectedTag(tagsMappedByTagId[currentInspectedTag.id] || null);
    }
  }, [tagsMappedByTagId]);

  useEffect(() => {
    if (baseTagId && tagsMappedByTagId) {
      setCurrentInspectedTag(tagsMappedByTagId[baseTagId] || null);
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
