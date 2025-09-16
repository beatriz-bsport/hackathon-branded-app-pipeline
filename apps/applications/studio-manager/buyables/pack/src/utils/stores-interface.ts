/**
 * This file proposes helpers to retrieve data from the right state/store
 * based on the variant input. It's a common interface for the 3 following stores:
 * - webshop
 * - pass
 * - appointment-pass
 */
import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import { ITEM_VARIANTS } from "./constants";
import {
  type AppointmentPass,
  useSelectAppointmentPassById,
  useSelectAppointmentPassCategories,
  useSelectAppointmentPassCategoryById,
  useSelectAppointmentPasses,
} from "./temp-store/appointment-pass";
import {
  type Pass,
  useSelectPassById,
  useSelectPassCategories,
  useSelectPassCategoryById,
  useSelectPasses,
} from "./temp-store/pass";
import {
  type WebshopItem,
  useSelectWebshopCategories,
  useSelectWebshopCategoryById,
  useSelectWebshopItemById,
  useSelectWebshopItems,
} from "./temp-store/webshop";

export const useItems = () => {
  const passes = useSelectPasses();
  const appointmentPasses = useSelectAppointmentPasses();
  const webshopItems = useSelectWebshopItems();

  return {
    [ITEM_VARIANTS.pass]: passes as Pass[],
    [ITEM_VARIANTS.appointmentPass]: appointmentPasses as AppointmentPass[],
    [ITEM_VARIANTS.webshopItem]: webshopItems as WebshopItem[],
  } as const;
};

export const useItemsById = () => {
  const passById = useSelectPassById();
  const apppintmentPassById = useSelectAppointmentPassById();
  const webshopItemById = useSelectWebshopItemById();

  return {
    [ITEM_VARIANTS.pass]: passById,
    [ITEM_VARIANTS.appointmentPass]: apppintmentPassById,
    [ITEM_VARIANTS.webshopItem]: webshopItemById,
  } as const;
};

export const useCategories = () => {
  const passCategories = useSelectPassCategories();
  const apppintmentPassCategories = useSelectAppointmentPassCategories();
  const webshopCategories = useSelectWebshopCategories();

  return {
    [ITEM_VARIANTS.pass]: passCategories,
    [ITEM_VARIANTS.appointmentPass]: apppintmentPassCategories,
    [ITEM_VARIANTS.webshopItem]: webshopCategories,
  } as const;
};

export const useCategoriesById = () => {
  const passCategoryById = useSelectPassCategoryById();
  const apppintmentPassCategoryById = useSelectAppointmentPassCategoryById();
  const webshopCategoryItemById = useSelectWebshopCategoryById();

  return {
    [ITEM_VARIANTS.pass]: passCategoryById,
    [ITEM_VARIANTS.appointmentPass]: apppintmentPassCategoryById,
    [ITEM_VARIANTS.webshopItem]: webshopCategoryItemById,
  } as const;
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
    price: getCurrencyDisplayWithPrice(price.parsedValue),
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
