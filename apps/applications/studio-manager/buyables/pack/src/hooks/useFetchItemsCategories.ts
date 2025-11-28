import { useEffect, useState } from "react";

import { fetchAppointmentPassCategoriesAction } from "@bsport/store-buyables-appointment-pass";
import { fetchPassCategoriesAction } from "@bsport/store-buyables-pass";
import { fetchWebshopCategoriesAction } from "@bsport/store-buyables-webshop";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@bsport/use-pagination-query-params";

import { ITEM_VARIANTS, type ItemVariant } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

const fetchPassCategoriesBound = fetchPassCategoriesAction.bind(null, fetch);

export const useFetchPassCategories = () => {
  const [{ isLoading: isLoadingPassCategories }, fetchPassCategories] =
    useAsync<typeof fetchPassCategoriesBound>({
      asyncFn: fetchPassCategoriesBound,
      onFailure: console.error,
    });

  return {
    isLoadingPassCategories,
    fetchPassCategories,
  };
};
const fetchAppointmentPassCategoriesBound =
  fetchAppointmentPassCategoriesAction.bind(null, fetch);

export const useFetchAppointmentPassCategories = () => {
  const [
    { isLoading: isLoadingAppointmentPassCategories },
    fetchAppointmentPassCategories,
  ] = useAsync<typeof fetchAppointmentPassCategoriesBound>({
    asyncFn: fetchAppointmentPassCategoriesBound,
    onFailure: console.error,
  });

  return {
    isLoadingAppointmentPassCategories,
    fetchAppointmentPassCategories,
  };
};

const fetchWebshopCategoriesBound = fetchWebshopCategoriesAction.bind(
  null,
  fetch,
);

export const useFetchWebshopCategories = () => {
  const [{ isLoading: isLoadingWebshopCategories }, fetchWebshopCategories] =
    useAsync<typeof fetchWebshopCategoriesBound>({
      asyncFn: fetchWebshopCategoriesBound,
      onFailure: console.error,
    });

  return {
    isLoadingWebshopCategories,
    fetchWebshopCategories,
  };
};

export const useFetchItemsCategories = ({
  variant,
}: {
  variant?: ItemVariant | null;
} = {}) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { fetchPassCategories, isLoadingPassCategories } =
    useFetchPassCategories();
  const { fetchAppointmentPassCategories, isLoadingAppointmentPassCategories } =
    useFetchAppointmentPassCategories();
  const { fetchWebshopCategories, isLoadingWebshopCategories } =
    useFetchWebshopCategories();

  // ----- Fetch data on change -----

  useEffect(() => {
    const params = {
      page,
      page_size: pageSize,
    };

    if (variant === ITEM_VARIANTS.pass) {
      fetchPassCategories(params);
    }
    if (variant === ITEM_VARIANTS.appointmentPass) {
      fetchAppointmentPassCategories(params);
    }
    if (variant === ITEM_VARIANTS.webshopItem) {
      fetchWebshopCategories(params);
    }
    if (!variant) {
      // Reset page state when closing the modal (e.g. variant being undefined)
      setPage(1);
    }
  }, [
    page,
    pageSize,
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
