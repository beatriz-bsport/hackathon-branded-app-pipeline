import type { FC } from "react";

import type { Fetch } from "@bsport/fetch";

import { useDisclosure } from "#src/utils/use-disclosure";

import { BookkeepingAccountModalCreator } from "../modal-creator/modal-creator";
import {
  BookkeepingAccountRawSelectorInner,
  type BookkeepingAccountRawSelectorInnerProps,
} from "./raw-selector-inner";
import { useFetchBookkeepingAccounts } from "./use-fetch-bookkeeping-accounts";

export type BookkeepingAccountRawSelectorProps = Omit<
  BookkeepingAccountRawSelectorInnerProps,
  "bookkeepingAccounts" | "isLoading" | "isEmpty"
> & { fetch: Fetch };

export const BookkeepingAccountRawSelector: FC<
  BookkeepingAccountRawSelectorProps
> = ({ fetch, ...otherProps }) => {
  const { data, isLoading, refetch } = useFetchBookkeepingAccounts({
    fetch,
    apiParams: { is_active: true },
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <BookkeepingAccountRawSelectorInner
        {...otherProps}
        bookkeepingAccounts={data ?? []}
        isLoading={isLoading}
        openCreationModal={onOpen}
      />
      {otherProps.withCreationFlow && (
        <BookkeepingAccountModalCreator
          closeModal={onClose}
          isOpen={isOpen}
          fetch={fetch}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
};
