// @ts-nocheck
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PaymentMethodList from './payment-method-list/PaymentMethodList.component';
import {
  fromPaymentGroupIdentifierToPaymentMethodIdentifier,
  PAYMENT_STRIPE_TERMINAL_FAKE,
} from '../utils';
import PaymentStripeTerminalWrapper from '#libs/terminal/components/PaymentStripeTerminalWrapper.component';
import { PaymentMethod } from '../types';
import type { StripeReader } from '#libs/terminal/types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  terminalContainer: {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId: string;
  requestSetupIntentSecret: () => Promise<any>;
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
  onSuccessTerminal: () => void;
  onCancelTerminal: () => void;
  stripeReaders: StripeReader[];
  setProcessing?: (value: boolean) => void;
  onlinePaymentEnabled?: boolean;
  cardBillingDetailsMandatory: boolean;
};

export const PaymentMethodSelector = (props: Props) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const readableIdentifier =
    fromPaymentGroupIdentifierToPaymentMethodIdentifier(
      props.paymentMethodType,
    );
  return (
    <div>
      {readableIdentifier === 'debt' && (
        <div className={classes.container}>
          <Typography>
            {t('paymentMethod.isInternalExplainFuturePayments')}
          </Typography>
        </div>
      )}
      {['card', 'sepa_debit', 'bacs_debit'].includes(readableIdentifier) && (
        <PaymentMethodList
          isExpanded
          showEmpty
          cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
          companyId={props.companyId}
          detachPaymentMethod={props.detachPaymentMethod}
          detachPaymentMethodLoading={props.detachPaymentMethodLoading}
          disabled={props.loading || props.processing || props.disabled}
          onDelete={!!props.detachPaymentMethod}
          onlinePaymentEnabled={props.onlinePaymentEnabled}
          onSelect={props.selectPaymentMethod}
          paymentMethodType={fromPaymentGroupIdentifierToPaymentMethodIdentifier(
            props.paymentGroupMethodIdentifier,
          )}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          savedPaymentMethodList={props.savedPaymentMethodList}
          selectedSavedPaymentMethodId={props.selectedSavedPaymentMethodId}
          sepaDefaultEmail={props.sepaDefaultEmail}
          sepaDefaultName={props.sepaDefaultName}
          snackbarErrorMsg={props.snackbarErrorMsg}
          snackbarSuccessMsg={props.snackbarSuccessMsg}
        />
      )}
      {props.paymentMethodType === PAYMENT_STRIPE_TERMINAL_FAKE && (
        <div className={classes.terminalContainer}>
          <PaymentStripeTerminalWrapper
            isSetupIntent
            onCancel={props.onCancelTerminal}
            onSuccess={props.onSuccessTerminal}
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            setProcessing={props.setProcessing}
            stripeReaders={props.stripeReaders}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
