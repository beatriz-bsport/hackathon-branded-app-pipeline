import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PaymentMethodList from './payment-method-list/PaymentMethodList.component';
import { fromPaymentGroupIdentifierToPaymentMethodIdentifier } from '../utils';
import { PaymentMethod } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

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
      {['card', 'sepa_debit'].includes(readableIdentifier) && (
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
