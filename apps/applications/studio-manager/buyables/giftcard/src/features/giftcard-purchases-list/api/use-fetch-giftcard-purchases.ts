import { useCallback, useEffect } from "react";

import type { ConsumerGiftcard } from "@bsport/api-buyables";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchConsumerGiftcardsAction,
  selectConsumerGiftcards,
  selectConsumerGiftcardsCount,
  useGiftcardStore,
} from "@bsport/store-buyables-giftcard";
import {
  type Member,
  fetchMembersAction,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

import type { PersonCell } from "../types";

const fetchMembersBound = fetchMembersAction.bind(null, fetch);

function getAugmentedGiftcardPurchases({
  giftcardPurchasesRaw,
  membersById,
}: {
  giftcardPurchasesRaw: ConsumerGiftcard[];
  membersById: { [key: number]: Member };
}) {
  if (!giftcardPurchasesRaw.length) {
    return [];
  }

  return giftcardPurchasesRaw.map((rawItem) => {
    const srcMember = rawItem.src_member
      ? membersById[rawItem.src_member]
      : null;
    const dstMember = rawItem.dst_member
      ? membersById[rawItem.dst_member]
      : null;

    return {
      ...rawItem,
      src_member: srcMember
        ? {
            id: srcMember.id,
            name: srcMember.name,
            avatarSrc: srcMember.photo,
          }
        : null,
      dst_member: dstMember
        ? {
            id: dstMember.id,
            name: dstMember.name,
            avatarSrc: dstMember.photo,
          }
        : null,
    };
  }) as Array<ConsumerGiftcard<number, PersonCell, PersonCell>>;
}

export const useFetchGiftcardPurchases = (giftcardId: number) => {
  // Control pagination state from URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // Define fetcher for Consumer Giftcards
  const fetchConsumerGiftcardsBound = useCallback(async () => {
    return fetchConsumerGiftcardsAction(fetch, {
      page: currentPage,
      page_size: currentPageSize,
      giftcard: giftcardId,
    });
  }, [currentPage, currentPageSize, giftcardId]);

  const [{ isLoading }, fetchConsumerGiftcards] = useAsync<
    typeof fetchConsumerGiftcardsBound
  >({
    asyncFn: fetchConsumerGiftcardsBound,
    onSuccess: ({ value }) => {
      const membersToFetch = value.results
        .flatMap((consumerGiftcard) => [
          consumerGiftcard.src_member,
          consumerGiftcard.dst_member,
        ])
        .filter((memberId) => memberId != null);

      const uniqMembersToFetch = Array.from(new Set(membersToFetch));

      if (uniqMembersToFetch.length === 0) {
        return;
      }

      fetchMembersBound({
        page: 1,
        page_size: uniqMembersToFetch.length,
        id__in: uniqMembersToFetch,
      });
    },
    dependencies: [fetchConsumerGiftcardsBound],
  });

  // Fetch items when settings are changing
  useEffect(() => {
    fetchConsumerGiftcards();
  }, [fetchConsumerGiftcards]);

  // Retrieve items from Zustand store
  const giftcardPurchasesRaw = useGiftcardStore(selectConsumerGiftcards);
  const totalItems = useGiftcardStore(selectConsumerGiftcardsCount);

  // Create final items
  const giftcardPurchases = useMemberStore((state) =>
    getAugmentedGiftcardPurchases({
      giftcardPurchasesRaw,
      membersById: state.byId,
    }),
  );

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };

  return {
    isLoading,
    paginationParams,
    giftcardPurchases,
    totalItems,
  };
};
