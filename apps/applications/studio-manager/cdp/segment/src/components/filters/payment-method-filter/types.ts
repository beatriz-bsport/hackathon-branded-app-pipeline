import type {
  CreatePaymentMethodFilterPayload,
  PaymentMethodFilter,
  UpdatePaymentMethodFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { OwnsPaymentMethodOption } from "./constants";
import type { PaymentMethodSubFilterId } from "./sub-filters/payment-method-sub-filter-id";

export type PaymentMethodFilterFormValue = {
  id?: number;
  smartlist: number;
  ownsPaymentMethod: OwnsPaymentMethodOption;
  subFilters: PaymentMethodSubFilterId[];
  expirationDate: DateFilterValue;
};

export type PaymentMethodFilterCardProps = {
  smartlistId: string;
  filterValue: PaymentMethodFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type PaymentMethodFilterCreatePayload = CreatePaymentMethodFilterPayload;
export type DirtyPatchPayload = UpdatePaymentMethodFilterPayload;

export type { PaymentMethodFilter };
