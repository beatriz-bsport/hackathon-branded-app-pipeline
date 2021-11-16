import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';

export type UserPreference = {
  paymentPackSort: SortOption;
  paymentPackCategoryFilter: Array<number>;
  paymentPackManagerOnlyFilter: ManagerOnly;
  scheduleTimerange: { begin: string; end: string };
};
