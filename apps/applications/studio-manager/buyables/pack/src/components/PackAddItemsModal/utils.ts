import { ITEM_VARIANTS } from "./constants";
import type { AppointmentPass, Pass, WebshopItem } from "./constants";

type VariantAndData =
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
    price,
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
    price,
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
    price,
    credits,
    category,
    archived: !available,
    unavailable: manager_only,
    invisible: !is_usable_by_staff,
    variant: ITEM_VARIANTS.appointmentPass,
  };
}
