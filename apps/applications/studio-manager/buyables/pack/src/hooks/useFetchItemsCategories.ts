import { useCallback, useEffect, useState } from "react";

import { fetchAppointmentPassCategoriesAction } from "@bsport/store-buyables-appointment-pass";
import { fetchPassCategoriesAction } from "@bsport/store-buyables-pass";
import { fetchWebshopCategoriesAction } from "@bsport/store-buyables-webshop";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@bsport/use-pagination-query-params";

import type { ItemVariant } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

type CategoriesAction =
  | typeof fetchPassCategoriesAction
  | typeof fetchWebshopCategoriesAction
  | typeof fetchAppointmentPassCategoriesAction;

export const useFetchItemsCategories = ({
  variant,
}: {
  variant: ItemVariant | null;
}) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const _fetchWithPagination = useCallback(
    (action: CategoriesAction) => {
      return action(fetch, {
        page,
        page_size: pageSize,
      });
    },
    [page, pageSize],
  );

  // ----- Webshop -----

  const _fetchWebshopCategories = useCallback(() => {
    return _fetchWithPagination(
      fetchWebshopCategoriesAction as CategoriesAction,
    );
  }, [_fetchWithPagination]);

  const [{ isLoading: isLoadingWebshopCategories }, fetchWebshopCategories] =
    useAsync<typeof _fetchWebshopCategories>({
      asyncFn: _fetchWebshopCategories,
      dependencies: [_fetchWebshopCategories],
      onFailure: console.error,
    });

  // ----- Pass -----

  const _fetchPassCategories = useCallback(() => {
    return _fetchWithPagination(fetchPassCategoriesAction as CategoriesAction);
  }, [_fetchWithPagination]);

  const [{ isLoading: isLoadingPassCategories }, fetchPassCategories] =
    useAsync<typeof _fetchPassCategories>({
      asyncFn: _fetchPassCategories,
      dependencies: [_fetchPassCategories],
      onFailure: console.error,
    });

  // ----- Appointment Pass -----

  const _fetchAppointmentPassCategories = useCallback(() => {
    return _fetchWithPagination(
      fetchAppointmentPassCategoriesAction as CategoriesAction,
    );
  }, [_fetchWithPagination]);

  const [
    { isLoading: isLoadingAppointmentPassCategories },
    fetchAppointmentPassCategories,
  ] = useAsync<typeof _fetchAppointmentPassCategories>({
    asyncFn: _fetchAppointmentPassCategories,
    dependencies: [_fetchAppointmentPassCategories],
    onFailure: console.error,
  });

  // ----- Fetch data on change -----

  useEffect(() => {
    if (variant === "pass") {
      fetchPassCategories();
    }
    if (variant === "appointmentPass") {
      fetchAppointmentPassCategories();
    }
    if (variant === "webshopItem") {
      fetchWebshopCategories();
    }
    if (!variant) {
      // Reset page state when closing the modal (e.g. variant being undefined)
      setPage(1);
    }
  }, [
    variant,
    fetchWebshopCategories,
    fetchPassCategories,
    fetchAppointmentPassCategories,
  ]);

  return {
    isLoading:
      isLoadingWebshopCategories ||
      isLoadingPassCategories ||
      isLoadingAppointmentPassCategories,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
};
