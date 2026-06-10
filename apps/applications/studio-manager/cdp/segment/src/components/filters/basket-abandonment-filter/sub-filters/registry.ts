import { abandonmentDateBasketAbandonmentSubFilterModule } from "./abandonment-date/module";
import type { BasketAbandonmentSubFilterId } from "./basket-abandonment-sub-filter-id";
import type { BasketAbandonmentSubFilterModule } from "./basket-abandonment-sub-filter-module-contract";

export const REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS: BasketAbandonmentSubFilterModule[] =
  [abandonmentDateBasketAbandonmentSubFilterModule];

export const REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS_BY_ID =
  REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<
      BasketAbandonmentSubFilterId,
      BasketAbandonmentSubFilterModule
    >,
  );
