import { useCallback, useEffect, useState } from "react";

import {
  type FetchAppointmentPassesParams,
  fetchAppointmentPassesAction,
} from "@bsport/store-buyables-appointment-pass";
import {
  type FetchPassesParams,
  fetchPassesAction,
} from "@bsport/store-buyables-pass";
import {
  type FetchWebshopItemsParams,
  fetchWebshopItemsAction,
} from "@bsport/store-buyables-webshop";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@bsport/use-pagination-query-params";

import type { ItemVariant } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

type CategoriesAction =
  | typeof fetchPassesAction
  | typeof fetchWebshopItemsAction
  | typeof fetchAppointmentPassesAction;

export const useFetchItems = ({
  variant,
  categoryId,
}: {
  variant: ItemVariant | null;
  categoryId?: number;
}) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const _fetchWithPagination = useCallback(
    ({
      action,
      params,
    }: {
      action: CategoriesAction;
      params?:
        | FetchWebshopItemsParams
        | FetchPassesParams
        | FetchAppointmentPassesParams;
    }) => {
      return action(fetch, {
        ...(params ?? {}),
        ...(categoryId
          ? { category: categoryId > 0 ? categoryId : "none" }
          : {}),
        page,
        page_size: pageSize,
      });
    },
    [page, pageSize, categoryId],
  );

  // ----- Webshop -----

  const _fetchWebshopItems = useCallback(
    (params?: FetchWebshopItemsParams) => {
      return _fetchWithPagination({
        action: fetchWebshopItemsAction as CategoriesAction,
        params,
      });
    },
    [_fetchWithPagination],
  );

  const [{ isLoading: isLoadingWebshopItems }, fetchWebshopItems] = useAsync<
    typeof _fetchWebshopItems
  >({
    asyncFn: _fetchWebshopItems,
    dependencies: [_fetchWebshopItems],
    onFailure: console.error,
  });

  // ----- Pass -----

  const _fetchPasses = useCallback(
    (params?: FetchPassesParams) => {
      return _fetchWithPagination({
        action: fetchPassesAction as CategoriesAction,
        params,
      });
    },
    [_fetchWithPagination],
  );

  const [{ isLoading: isLoadingPasses }, fetchPasses] = useAsync<
    typeof _fetchPasses
  >({
    asyncFn: _fetchPasses,
    dependencies: [_fetchPasses],
    onFailure: console.error,
  });

  // ----- Appointment Pass -----

  const _fetchAppointmentPasses = useCallback(
    (params?: FetchAppointmentPassesParams) => {
      return _fetchWithPagination({
        action: fetchAppointmentPassesAction as CategoriesAction,
        params,
      });
    },
    [_fetchWithPagination],
  );

  const [{ isLoading: isLoadingAppointmentPasses }, fetchAppointmentPasses] =
    useAsync<typeof _fetchAppointmentPasses>({
      asyncFn: _fetchAppointmentPasses,
      dependencies: [_fetchAppointmentPasses],
      onFailure: console.error,
    });

  // ----- Fetch data on change -----

  useEffect(() => {
    if (categoryId === null || categoryId === undefined) {
      // Even for no-category category there is an id. Here it means it's the category list view.
      setPage(1);
      return;
    }
    if (variant === "pass") {
      fetchPasses();
    }
    if (variant === "appointmentPass") {
      fetchAppointmentPasses();
    }
    if (variant === "webshopItem") {
      fetchWebshopItems();
    }
    if (!variant) {
      // Reset page state when closing the modal (e.g. variant being undefined)
      setPage(1);
    }
  }, [
    variant,
    fetchWebshopItems,
    fetchPasses,
    fetchAppointmentPasses,
    categoryId,
  ]);

  return {
    isLoading:
      isLoadingWebshopItems || isLoadingPasses || isLoadingAppointmentPasses,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
};
