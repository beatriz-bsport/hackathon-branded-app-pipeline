import { queryOptions, useQuery } from "@tanstack/react-query";

import type { Fetch } from "@bsport/fetch";
import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Giftcard } from "@bsport/store-buyables-giftcard";
import type { Pack } from "@bsport/store-buyables-pack";
import type { Pass } from "@bsport/store-buyables-pass";
import type { WebshopItem } from "@bsport/store-buyables-webshop";

import { useItemTypeConfig } from "./create-item-type-config";
import { fetchSearchItems } from "./fetch-search-items";
import type { ItemAutocompleteItemKind } from "./item-autocomplete";
import type {
  RawAppointmentPassResponse,
  RawPackResponse,
  RawPassResponse,
  RawWebshopItemResponse,
} from "./item-type-configs";

type StaffUsableBuyableItem =
  | Pass
  | AppointmentPass
  | Pack
  | WebshopItem
  | Giftcard;

/**
 * Returns whether a buyable item can be added to a staff-created invoice.
 * Mirrors legacy bill-member filtering in `getBuyableItem`.
 * @see apps/applications/saas-legacy/src/libs/invoice/selectors.ts
 */
const isStaffUsableBuyableItem = (
  itemType: ItemAutocompleteItemKind,
  item: StaffUsableBuyableItem,
) => {
  switch (itemType) {
    case "pass":
      return (item as Pass).is_usable_by_staff;
    case "appointment_pass": {
      const appointmentPass = item as AppointmentPass;
      return (
        appointmentPass.is_usable_by_staff &&
        !appointmentPass.is_unpaid_private_booking_integration
      );
    }
    case "pack":
      return (item as Pack).is_usable_by_staff;
    default:
      return true;
  }
};

const itemsQueryOptions = (
  fetch: Fetch,
  itemType: ItemAutocompleteItemKind,
  searchInput: string,
) => {
  return queryOptions({
    queryKey: ["buyableItems", itemType, searchInput],
    queryFn: async () => {
      return await fetchSearchItems(fetch, { itemType, searchInput });
    },
  });
};

/**
 * Searches buyable items for the checkout-flow item autocomplete.
 *
 * Staff-usability filtering (`is_usable_by_staff`, and
 * `is_unpaid_private_booking_integration` for appointment passes) is applied
 * **client-side after the API response**, matching legacy bill-member behaviour
 * (`getBuyableItem` in saas-legacy).
 *
 * **Backend limitation:** the search endpoints used here do not accept an
 * `is_usable_by_staff` query param (unlike subscriptions/contracts). Pass,
 * appointment-pass, and pack filtersets only expose fields such as `disabled`,
 * `manager_only`, and `available` - see `PaymentPackFilterSet`,
 * `PrivatePassFilterSet`, and `PaymentComboFilterSet` in bsport-django.
 * Franchise **templates** support `available_for_sale`, but that does not apply
 * to company-level buyables fetched here.
 *
 * **Consequence:** we request `page_size=20` but may return fewer items when
 * some results are hidden from staff (e.g. 20 requested → 16 shown). We do not
 * paginate further to "fill up" to 20; that would add latency and complexity
 * for a case legacy also accepted when filtering client-side.
 */
export const useSearchItems = ({
  fetch,
  itemType,
  searchInput,
}: {
  fetch: Fetch;
  itemType: ItemAutocompleteItemKind;
  searchInput: string;
}) => {
  const itemTypeConfig = useItemTypeConfig();

  return useQuery({
    ...itemsQueryOptions(fetch, itemType, searchInput || ""),
    select: (rawItems) => {
      const staffUsableItems = rawItems.filter((item) =>
        isStaffUsableBuyableItem(itemType, item),
      );

      switch (itemType) {
        case "pass": {
          const passItems = staffUsableItems;
          const config = itemTypeConfig.pass;
          return passItems.map((item) =>
            config.getListItemConfiguration(item as RawPassResponse),
          );
        }
        case "appointment_pass": {
          const appointmentPassItems = staffUsableItems;
          const config = itemTypeConfig.appointment_pass;
          return appointmentPassItems.map((item) =>
            config.getListItemConfiguration(item as RawAppointmentPassResponse),
          );
        }
        case "product": {
          const webshopItems = staffUsableItems;
          const config = itemTypeConfig.product;
          return webshopItems.map((item) =>
            config.getListItemConfiguration(item as RawWebshopItemResponse),
          );
        }
        case "pack": {
          const packItems = staffUsableItems;
          const config = itemTypeConfig.pack;
          return packItems.map((item) =>
            config.getListItemConfiguration(item as RawPackResponse),
          );
        }
        case "giftcard": {
          const giftcardItems = staffUsableItems as Giftcard[];
          const config = itemTypeConfig.giftcard;
          // TODO: Backend search for giftcard doesn't work - filter on client side
          // Once backend search is implemented, remove this client-side filtering
          return giftcardItems.map((item) =>
            config.getListItemConfiguration(item),
          );
        }
        default:
          return [];
      }
    },
  });
};
