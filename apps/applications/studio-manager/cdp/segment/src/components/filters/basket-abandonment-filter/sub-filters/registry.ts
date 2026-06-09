import { abandonmentDateBasketAbandonmentSubFilterModule } from "./abandonment-date/module";
import type { BasketAbandonmentSubFilterModule } from "./basket-abandonment-sub-filter-module-contract";

export const REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS: BasketAbandonmentSubFilterModule[] =
  [abandonmentDateBasketAbandonmentSubFilterModule];
