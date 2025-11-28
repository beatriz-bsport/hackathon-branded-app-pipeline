import { useEffect, useState } from "react";

import {
  type AppointmentPass,
  fetchAppointmentPassesAction,
} from "@bsport/store-buyables-appointment-pass";
import { type Pass, fetchPassesAction } from "@bsport/store-buyables-pass";
import {
  type WebshopItem,
  fetchWebshopItemsAction,
} from "@bsport/store-buyables-webshop";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@bsport/use-pagination-query-params";

import type { ItemVariant } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

const fetchPassesBound = fetchPassesAction.bind(null, fetch);

export const useFetchPasses = ({
  onSuccess,
}: {
  onSuccess?: (items: Pass[]) => void;
} = {}) => {
  const [{ isLoading: isLoadingPasses }, fetchPasses] = useAsync<
    typeof fetchPassesBound
  >({
    asyncFn: fetchPassesBound,
    onFailure: console.error,
    onSuccess: ({ value }) => onSuccess?.(value.results),
  });

  return {
    isLoadingPasses,
    fetchPasses,
  };
};

const fetchAppointmentPassesBound = fetchAppointmentPassesAction.bind(
  null,
  fetch,
);

export const useFetchAppointmentPasses = ({
  onSuccess,
}: {
  onSuccess?: (items: AppointmentPass[]) => void;
} = {}) => {
  const [{ isLoading: isLoadingAppointmentPasses }, fetchAppointmentPasses] =
    useAsync<typeof fetchAppointmentPassesBound>({
      asyncFn: fetchAppointmentPassesBound,
      onFailure: console.error,
      onSuccess: ({ value }) => onSuccess?.(value.results),
    });

  return {
    isLoadingAppointmentPasses,
    fetchAppointmentPasses,
  };
};

const fetchWebshopItemsBound = fetchWebshopItemsAction.bind(null, fetch);

export const useFetchWebshopItems = ({
  onSuccess,
}: {
  onSuccess?: (items: WebshopItem[]) => void;
} = {}) => {
  const [{ isLoading: isLoadingWebshopItems }, fetchWebshopItems] = useAsync<
    typeof fetchWebshopItemsBound
  >({
    asyncFn: fetchWebshopItemsBound,
    onFailure: console.error,
    onSuccess: ({ value }) => onSuccess?.(value.results),
  });

  return {
    isLoadingWebshopItems,
    fetchWebshopItems,
  };
};

export const useFetchItems = ({
  variant,
  categoryId,
}: {
  variant?: ItemVariant | null;
  categoryId?: number;
} = {}) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { fetchPasses, isLoadingPasses } = useFetchPasses();
  const { fetchAppointmentPasses, isLoadingAppointmentPasses } =
    useFetchAppointmentPasses();
  const { fetchWebshopItems, isLoadingWebshopItems } = useFetchWebshopItems();

  // ----- Fetch data on change -----

  useEffect(() => {
    if (categoryId === null || categoryId === undefined) {
      // Even for no-category category there is an id. Here it means it's the category list view.
      setPage(1);
      return;
    }
    const params = {
      // todo: Unlock when category can be filtered in the backend -wip-
      // ...(categoryId
      //   ? { category: categoryId > 0 ? categoryId : "unset" }
      //   : {}),
      page,
      page_size: pageSize,
    };

    if (variant === "pass") {
      fetchPasses(params);
    }
    if (variant === "appointmentPass") {
      fetchAppointmentPasses(params);
    }
    if (variant === "webshopItem") {
      fetchWebshopItems(params);
    }
    if (!variant) {
      // Reset page state when closing the modal (e.g. variant being undefined)
      setPage(1);
    }
  }, [
    page,
    pageSize,
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
