import React from 'react';
import PaymentMethodList from './PaymentMethodList.component';
import { fromPaymentGroupIdentifierToPaymentMethodIdentifier } from '../utils';
import { PaymentMethod } from '../types';

type Props = {
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId: string;
  requestSetupIntentSecret: (id: string) => void;
  refreshSavedPaymentMethodList: () => void;
  paymentMethodType: string;
  loading: boolean;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  sepaDefaultName: string | null;
  sepaDefaultEmail: string | null;
  companyId: number;
  detachPaymentMethod: (pmId: string) => void;
  detachPaymentMethodLoading: boolean;
  processing: boolean;
  disabled: boolean;
  selectPaymentMethod: (paymentMethodType: string) => void;
};

export const PaymentMethodSelector = (props: Props) => {
  return (
    <div>
      {['card', 'sepa_debit'].includes(
        fromPaymentGroupIdentifierToPaymentMethodIdentifier(
          props.paymentMethodType,
        ),
      ) && (
        <PaymentMethodList
          showEmpty
          isExpanded
          onDelete={!!props.detachPaymentMethod}
          savedPaymentMethodList={props.savedPaymentMethodList}
          selectedSavedPaymentMethodId={props.selectedSavedPaymentMethodId}
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          paymentMethodType={fromPaymentGroupIdentifierToPaymentMethodIdentifier(
            props.paymentGroupMethodIdentifier,
          )}
          onSelect={props.selectPaymentMethod}
          disabled={props.loading || props.processing || props.disabled}
          detachPaymentMethodLoading={props.detachPaymentMethodLoading}
          companyId={props.companyId}
          detachPaymentMethod={props.detachPaymentMethod}
          snackbarErrorMsg={props.snackbarErrorMsg}
          snackbarSuccessMsg={props.snackbarSuccessMsg}
          sepaDefaultName={props.sepaDefaultName}
          sepaDefaultEmail={props.sepaDefaultEmail}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector;
