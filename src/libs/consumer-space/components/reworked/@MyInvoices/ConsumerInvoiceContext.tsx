import React, { createContext, ReactNode, useCallback } from 'react';
import type { ConsumerInvoiceContextType } from './types';
import type { OptionCallback } from '#src/state/types';

export const ConsumerInvoiceContext =
  createContext<ConsumerInvoiceContextType>(null);

type ProviderProps = {
  fetchPaymentGroupStatusAction?: (
    paymentGroupId: number,
    options?: OptionCallback<number>,
  ) => void;
  setPaymentStatusActions?: (params: {
    paymentGroupId: number;
    paymentSucceeded?: boolean;
    paymentProcessing?: boolean;
  }) => void;
  getReceiptUrl?: (uuid: string, options?: OptionCallback<string>) => void;
  detachPaymentMethod?: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
} & {
  children?: ReactNode | undefined;
};

const ConsumerInvoiceContextProvider: React.FC<ProviderProps> = ({
  children,
  fetchPaymentGroupStatusAction,
  setPaymentStatusActions,
  getReceiptUrl,
  detachPaymentMethod,
}) => {
  const handleWidgetFetchPaymentGroupStatus = useCallback(
    (paymentGroupId: number, options?: OptionCallback<number>) => {
      fetchPaymentGroupStatusAction(paymentGroupId, options);
    },
    [fetchPaymentGroupStatusAction],
  );

  const handleWidgetSetPaymentStatus = useCallback(
    (params: {
      paymentGroupId: number;
      paymentSucceeded?: boolean;
      paymentProcessing?: boolean;
    }) => {
      setPaymentStatusActions(params);
    },
    [setPaymentStatusActions],
  );

  return (
    <ConsumerInvoiceContext.Provider
      value={{
        handleWidgetFetchPaymentGroupStatus,
        handleWidgetSetPaymentStatus,
        getReceiptUrl,
        detachPaymentMethod,
      }}
    >
      {children}
    </ConsumerInvoiceContext.Provider>
  );
};

export default ConsumerInvoiceContextProvider;
