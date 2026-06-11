import { expirationDatePaymentMethodSubFilterModule } from "./expiration-date/module";
import type { PaymentMethodSubFilterModule } from "./payment-method-sub-filter-module-contract";

/**
 * Ordered list of payment-method sub-filter modules.
 */
export const REGISTERED_PAYMENT_METHOD_SUB_FILTERS: PaymentMethodSubFilterModule[] =
  [expirationDatePaymentMethodSubFilterModule];
