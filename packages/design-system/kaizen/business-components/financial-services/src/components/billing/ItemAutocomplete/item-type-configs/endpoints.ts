import type { ItemAutocompleteItemKind } from "../ItemAutocomplete";

// TODO: Update endpoints to use constants from store packages once they're exported
// These endpoints should be linked to changes in:
// - @bsport/store-buyables-pass (pass) - packages/stores/buyables/pass/src/api/constants.ts
// - @bsport/store-buyables-appointment-pass (appointment_pass) - packages/stores/buyables/appointment-pass/src/api/constants.ts
// - @bsport/store-buyables-webshop (product) - packages/stores/buyables/webshop/src/api/constants.ts
// - @bsport/store-buyables-pack (pack) - packages/stores/buyables/pack/src/api.ts
// - @bsport/store-buyables-giftcard (giftcard) - packages/stores/buyables/giftcard/src/api.ts
// See !2016 when merged

export const itemTypeEndpointConfig: Record<
  ItemAutocompleteItemKind,
  {
    endpoint: string;
    searchParam: "q" | "search";
    supportsDisabledFilter: boolean;
  }
> = {
  pass: {
    endpoint: "buyable/v1/payment-pack/payment-pack/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  appointment_pass: {
    endpoint: "book/v1/private_service/private_pass/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  product: {
    endpoint: "buyable/v1/shop/item/search/",
    searchParam: "q",
    supportsDisabledFilter: true,
  },
  pack: {
    endpoint: "buyable/v1/payment_combo/search/",
    searchParam: "q",
    supportsDisabledFilter: false,
  },
  giftcard: {
    endpoint: "buyable/v1/giftcard/giftcard/",
    searchParam: "search",
    supportsDisabledFilter: true,
  },
};
