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
          showEmpty
          isExpanded
          onDelete={!!props.detachPaymentMethod}
          savedPaymentMethodList={props.savedPaymentMethodList}
          selectedSavedPaymentMethodId={props.selectedSavedPaymentMethodId}
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          onlinePaymentEnabled={props.onlinePaymentEnabled}
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
      {props.paymentMethodType === PAYMENT_STRIPE_TERMINAL_FAKE && (
        <div className={classes.terminalContainer}>
          <PaymentStripeTerminalWrapper
            stripeReaders={props.stripeReaders}
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            onCancel={props.onCancelTerminal}
            onSuccess={props.onSuccessTerminal}
            setProcessing={props.setProcessing}
            companyId={props.companyId}
            isSetupIntent
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
