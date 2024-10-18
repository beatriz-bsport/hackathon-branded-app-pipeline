import type { OptionCallback } from '#src/state/types';

export type ConsumerInvoiceContextType = {
  handleWidgetFetchPaymentGroupStatus?: (
    paymentGroupId: number,
    options?: OptionCallback<number>,
  ) => void;
  handleWidgetSetPaymentStatus?: (params: {
    paymentGroupId: number;
    paymentSucceeded?: boolean;
    paymentProcessing?: boolean;
  }) => void;
};
