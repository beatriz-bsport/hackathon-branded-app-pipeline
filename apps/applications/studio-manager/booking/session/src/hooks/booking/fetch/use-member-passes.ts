import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import {
  type ConsumerPaymentPack,
  type Pass,
  compatibleBySessionQueryOptions,
  nonCompatibleBySessionQueryOptions,
  passesQueryOptions,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export type RefinedConsumerPaymentPack = ConsumerPaymentPack & {
  passData: Pass;
};

type UseMemberPassesParams = {
  memberId: number;
  sessionId: number;
};

export const useMemberPasses = ({
  memberId,
  sessionId,
}: UseMemberPassesParams) => {
  const [compatiblePassesQuery, nonCompatiblePassQuery] = useQueries({
    queries: [
      {
        ...compatibleBySessionQueryOptions(fetch, sessionId, {
          member: memberId,
        }),
        placeholderData: keepPreviousData,
      },
      nonCompatibleBySessionQueryOptions(fetch, sessionId, {
        member: memberId,
      }),
    ],
  });

  const allPacks = useMemo(() => {
    const compatible = compatiblePassesQuery.data ?? [];
    const nonCompatible = nonCompatiblePassQuery.data ?? [];
    return [...compatible, ...nonCompatible];
  }, [compatiblePassesQuery.data, nonCompatiblePassQuery.data]);

  const passIds = useMemo(
    () => [
      ...new Set(
        allPacks.map((cpp) => cpp.payment_pack).filter((id) => id != null),
      ),
    ],
    [allPacks],
  );

  const passesQuery = useQuery({
    ...passesQueryOptions(fetch, {
      id__in: passIds,
      page_size: passIds.length,
    }),
    enabled:
      passIds.length > 0 &&
      !compatiblePassesQuery.isLoading &&
      !nonCompatiblePassQuery.isLoading,
  });

  const passesMap = useMemo(
    () =>
      new Map((passesQuery.data?.results ?? []).map((pass) => [pass.id, pass])),
    [passesQuery.data?.results],
  );

  const enrich = useCallback(
    (packs: ConsumerPaymentPack[]): RefinedConsumerPaymentPack[] =>
      packs.flatMap((cpp) => {
        const passData = passesMap.get(cpp.payment_pack);
        if (!passData) return [];
        return [{ ...cpp, passData }];
      }),
    [passesMap],
  );

  const compatiblePasses = useMemo(
    () => enrich(compatiblePassesQuery.data ?? []),
    [compatiblePassesQuery.data, enrich],
  );

  const incompatiblePasses = useMemo(
    () => enrich(nonCompatiblePassQuery.data ?? []),
    [nonCompatiblePassQuery.data, enrich],
  );

  const isLoading =
    compatiblePassesQuery.isLoading ||
    nonCompatiblePassQuery.isLoading ||
    passesQuery.isLoading;

  const error =
    compatiblePassesQuery.error ||
    nonCompatiblePassQuery.error ||
    passesQuery.error;

  return {
    compatiblePasses: {
      results: compatiblePasses,
      count: compatiblePasses.length ?? 0,
      isLoading,
      error,
    },
    incompatiblePasses: {
      results: incompatiblePasses,
      count: incompatiblePasses.length ?? 0,
      isLoading,
      error,
    },
  };
};
