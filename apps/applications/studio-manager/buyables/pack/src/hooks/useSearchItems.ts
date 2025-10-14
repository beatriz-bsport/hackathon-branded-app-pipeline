import { useCallback, useEffect, useState } from "react";

import {
  type SearchAppointmentPassesParams,
  searchAppointmentPassesAction,
} from "@bsport/store-buyables-appointment-pass";
import {
  type SearchPassesParams,
  searchPassesAction,
} from "@bsport/store-buyables-pass";
import {
  type SearchWebshopItemsParams,
  searchWebshopItemsAction,
} from "@bsport/store-buyables-webshop";
import { useAsync } from "@bsport/use-async";
import { useDebounce } from "@bsport/use-debounce";

import type { ItemVariant } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

type CategoriesAction =
  | typeof searchPassesAction
  | typeof searchWebshopItemsAction
  | typeof searchAppointmentPassesAction;

export const useSearchItems = ({
  variant,
}: {
  variant: ItemVariant | null;
}) => {
  const [queryString, setQueryString] = useState("");
  const debouncedSetQueryString = useDebounce(setQueryString);

  const _searchWithPagination = useCallback(
    ({
      action,
      params,
    }: {
      action: CategoriesAction;
      params?:
        | SearchWebshopItemsParams
        | SearchPassesParams
        | SearchAppointmentPassesParams;
    }) => {
      return action(fetch, {
        ...(params ?? {}),
        q: queryString.trim(),
      });
    },
    [queryString],
  );

  // ----- Webshop -----

  const _searchWebshopItems = useCallback(
    (params?: SearchWebshopItemsParams) => {
      return _searchWithPagination({
        action: searchWebshopItemsAction as CategoriesAction,
        params,
      });
    },
    [_searchWithPagination],
  );

  const [{ isLoading: isLoadingWebshopItems }, searchWebshopItems] = useAsync<
    typeof _searchWebshopItems
  >({
    asyncFn: _searchWebshopItems,
    dependencies: [_searchWebshopItems],
    onFailure: console.error,
  });

  // ----- Pass -----

  const _searchPasses = useCallback(
    (params?: SearchPassesParams) => {
      return _searchWithPagination({
        action: searchPassesAction as CategoriesAction,
        params,
      });
    },
    [_searchWithPagination],
  );

  const [{ isLoading: isLoadingPasses }, searchPasses] = useAsync<
    typeof _searchPasses
  >({
    asyncFn: _searchPasses,
    dependencies: [_searchPasses],
    onFailure: console.error,
  });

  // ----- Appointment Pass -----

  const _searchAppointmentPasses = useCallback(
    (params?: SearchAppointmentPassesParams) => {
      return _searchWithPagination({
        action: searchAppointmentPassesAction as CategoriesAction,
        params,
      });
    },
    [_searchWithPagination],
  );

  const [{ isLoading: isLoadingAppointmentPasses }, searchAppointmentPasses] =
    useAsync<typeof _searchAppointmentPasses>({
      asyncFn: _searchAppointmentPasses,
      dependencies: [_searchAppointmentPasses],
      onFailure: console.error,
    });

  // ----- Search data on change -----

  useEffect(() => {
    if (!queryString.trim()) {
      return;
    }
    if (variant === "pass") {
      searchPasses();
    }
    if (variant === "appointmentPass") {
      searchAppointmentPasses();
    }
    if (variant === "webshopItem") {
      searchWebshopItems();
    }
  }, [
    variant,
    queryString,
    searchWebshopItems,
    searchPasses,
    searchAppointmentPasses,
  ]);

  return {
    isSearching:
      isLoadingWebshopItems || isLoadingPasses || isLoadingAppointmentPasses,
    queryString,
    setQueryString: debouncedSetQueryString,
  };
};
