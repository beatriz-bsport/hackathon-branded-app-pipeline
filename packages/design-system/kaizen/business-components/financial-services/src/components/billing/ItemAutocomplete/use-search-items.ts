import { queryOptions, useQuery } from "@tanstack/react-query";

import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Giftcard } from "@bsport/store-buyables-giftcard";
import type { Pack } from "@bsport/store-buyables-pack";
import type { Pass } from "@bsport/store-buyables-pass";
import type { WebshopItem } from "@bsport/store-buyables-webshop";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { ItemAutocompleteItemKind } from "./ItemAutocomplete";
import { fetchSearchItems } from "./fetch-search-items";
import {
  type RawAppointmentPassResponse,
  type RawGiftcardResponse,
  type RawPackResponse,
  type RawPassResponse,
  type RawWebshopItemResponse,
  type TranslationFunction,
  createItemTypeConfig,
} from "./item-type-config";

const itemsQueryOptions = (
  itemType: ItemAutocompleteItemKind,
  searchInput: string,
) => {
  return queryOptions({
    queryKey: ["buyableItems", itemType, searchInput],
    queryFn: async () => {
      return await fetchSearchItems({ itemType, searchInput });
    },
  });
};

export const useSearchItems = ({
  itemType,
  searchInput,
}: {
  itemType: ItemAutocompleteItemKind;
  searchInput: string;
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const itemTypeConfig = createItemTypeConfig(t as TranslationFunction);

  return useQuery({
    ...itemsQueryOptions(itemType, searchInput || ""),
    select: (rawItems) => {
      switch (itemType) {
        case "pass": {
          const passItems = rawItems as Pass[];
          const config = itemTypeConfig.pass;
          return passItems.map((item) =>
            config.getListItemConfiguration(item as RawPassResponse),
          );
        }
        case "appointment_pass": {
          const appointmentPassItems = rawItems as AppointmentPass[];
          const config = itemTypeConfig.appointment_pass;
          return appointmentPassItems.map((item) =>
            config.getListItemConfiguration(item as RawAppointmentPassResponse),
          );
        }
        case "product": {
          const webshopItems = rawItems as WebshopItem[];
          const config = itemTypeConfig.product;
          return webshopItems.map((item) =>
            config.getListItemConfiguration(item as RawWebshopItemResponse),
          );
        }
        case "pack": {
          const packItems = rawItems as Pack[];
          const config = itemTypeConfig.pack;
          return packItems.map((item) =>
            config.getListItemConfiguration(item as RawPackResponse),
          );
        }
        case "giftcard": {
          const giftcardItems = rawItems as Giftcard[];
          const config = itemTypeConfig.giftcard;
          // TODO: Backend search for giftcard doesn't work - filter on client side
          // Once backend search is implemented, remove this client-side filtering
          return giftcardItems.map((item) =>
            config.getListItemConfiguration(item as RawGiftcardResponse),
          );
        }
        default:
          return [];
      }
    },
  });
};
