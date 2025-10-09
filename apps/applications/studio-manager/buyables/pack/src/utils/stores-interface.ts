/**
 * This file proposes helpers to retrieve data from the right state/store
 * based on the variant input. It's a common interface for the 3 following stores:
 * - webshop
 * - pass
 * - appointment-pass
 * Additionally, it provides a hook to retrieve tags information
 */
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  type AppointmentPass,
  selectAppointmentPassCategories,
  selectAppointmentPassCategoriesById,
  selectAppointmentPassCategoriesCount,
  selectAppointmentPasses,
  selectAppointmentPassesById,
  selectAppointmentPassesCount,
  selectAppointmentPassesSearched,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";
import "@bsport/store-buyables-pass";
import {
  type Pass,
  selectActivePasses,
  selectActivePassesCount,
  selectPassCategories,
  selectPassCategoriesById,
  selectPassCategoriesCount,
  selectPassesById,
  selectSearchedPasses,
  usePassStore,
} from "@bsport/store-buyables-pass";
import {
  type WebshopItem,
  selectActiveWebshopItems,
  selectActiveWebshopItemsCount,
  selectSearchedWebshopItems,
  selectWebshopCategories,
  selectWebshopCategoriesById,
  selectWebshopCategoriesCount,
  selectWebshopItemsById,
  useWebshopStore,
} from "@bsport/store-buyables-webshop";
import {
  selectTagGroups,
  selectTagMappedByTagId,
  selectTags,
  useTagStore,
} from "@bsport/store-cdp-tag";

import { ITEM_VARIANTS } from "./constants";

export const useItems = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectActivePasses),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPasses,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectActiveWebshopItems),
  } as const;
};

export const useItemsCount = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectActivePassesCount),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassesCount,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectActiveWebshopItemsCount),
  } as const;
};

export const useSearchedItems = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectSearchedPasses),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassesSearched,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectSearchedWebshopItems),
  } as const;
};

export const useItemsById = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectPassesById),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassesById,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectWebshopItemsById),
  } as const;
};

export const useCategories = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectPassCategories),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassCategories,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectWebshopCategories),
  } as const;
};

export const useCategoriesById = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectPassCategoriesById),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassCategoriesById,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectWebshopCategoriesById),
  } as const;
};

export const useCategoriesCount = () => {
  return {
    [ITEM_VARIANTS.pass]: usePassStore(selectPassCategoriesCount),
    [ITEM_VARIANTS.appointmentPass]: useAppointmentPassStore(
      selectAppointmentPassCategoriesCount,
    ),
    [ITEM_VARIANTS.webshopItem]: useWebshopStore(selectWebshopCategoriesCount),
  } as const;
};

export const useTags = () => {
  const tags = useTagStore(selectTags);
  const tagGroups = useTagStore(selectTagGroups);
  const tagIdToTagMap = useTagStore(selectTagMappedByTagId);
  return { tags, tagGroups, tagIdToTagMap };
};

export { AppointmentPass, Pass, WebshopItem };

export type VariantAndData =
  | {
      variant: "webshopItem";
      data: WebshopItem[];
    }
  | {
      variant: "pass";
      data: Pass[];
    }
  | {
      variant: "appointmentPass";
      data: AppointmentPass[];
    };

export function formatData({ variant, data }: VariantAndData) {
  if (variant === ITEM_VARIANTS.webshopItem) {
    return data.map(formatWebshopItemData);
  }

  if (variant === ITEM_VARIANTS.pass) {
    return data.map(formatPassData);
  }

  return data.map(formatAppointmentPassData);
}

export type FormattedData = ReturnType<typeof formatData>[number];

function formatWebshopItemData(data: WebshopItem) {
  const {
    id,
    name,
    price,
    disabled,
    size,
    cover,
    subshop,
    marketplace_enabled,
  } = data;
  return {
    // Shared variables
    id: String(id),
    name,
    price: getCurrencyDisplayWithPrice(parseFloat(price)),
    credits: null,
    archived: disabled,
    category: subshop,
    unavailable: !marketplace_enabled,
    invisible: null,
    variant: ITEM_VARIANTS.webshopItem,
    // Custom variables
    cover,
    size,
  };
}

function formatPassData(data: Pass) {
  const {
    id,
    name,
    price,
    credits,
    manager_only,
    is_usable_by_staff,
    category,
    disabled,
  } = data;
  return {
    // Shared variables
    id: String(id),
    name,
    price:
      typeof price === "number"
        ? getCurrencyDisplayWithPrice(price)
        : getCurrencyDisplayWithPrice(price.parsedValue),
    credits,
    category,
    archived: disabled,
    unavailable: manager_only,
    invisible: !is_usable_by_staff,
    variant: ITEM_VARIANTS.pass,
  };
}

function formatAppointmentPassData(data: AppointmentPass) {
  const {
    available,
    category,
    credits,
    id,
    is_usable_by_staff,
    manager_only,
    name,
    price,
  } = data;
  return {
    // Shared variables
    id: String(id),
    name,
    price: getCurrencyDisplayWithPrice(parseFloat(price)),
    credits,
    category,
    archived: !available,
    unavailable: manager_only,
    invisible: !is_usable_by_staff,
    variant: ITEM_VARIANTS.appointmentPass,
  };
}
