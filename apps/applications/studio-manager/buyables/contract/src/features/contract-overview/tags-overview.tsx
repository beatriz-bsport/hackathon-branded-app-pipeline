import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

import { fetchTagsQueryOptions } from "@bsport/api-cdp/tags";
import {
  ChipList,
  type ChipListItem,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";

type TagsOverviewProps = {
  tags: number[];
};

export const TagsOverview: FC<TagsOverviewProps> = ({ tags }) => {
  const { data, isFetching } = useQuery({
    ...fetchTagsQueryOptions(fetch),
    staleTime: 5 * 60 * 1_000,
    enabled: tags.length > 0,
  });

  if (isFetching) {
    return <Loader size="md" className="mx-auto" />;
  }

  const chips: ChipListItem[] = (data ?? [])
    .filter((tag) => tags.includes(tag.id))
    .map((tag) => {
      return {
        id: tag.id.toString(),
        label: tag.name,
        color: "default",
        customColor: tag.color,
        size: "lg" as const,
        type: "weak",
      } satisfies ChipListItem;
    });

  return <ChipList className="mt-xs" chips={chips} maxDisplay={5} />;
};
