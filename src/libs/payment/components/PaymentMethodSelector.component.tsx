import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash/cloneDeep';
import PaymentMethodList from './payment-method-list/PaymentMethodList.component';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '../utils';
import PaymentStripeTerminalWrapper from '#libs/terminal/components/PaymentStripeTerminalWrapper.component';
import { PaymentMethod } from '../types';
import type { StripeReader } from '#libs/terminal/types';
import {
  BillingDetails,
  MarketplacePaymentMethods,
} from '#libs/marketplace/types';

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
  setAreBillingDetailsProvided: React.Dispatch<React.SetStateAction<boolean>>;
  areInitialBillingDetailsNecessary: boolean;

  setAreInitialBillingDetailsNecessary: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  billingDetails: BillingDetails;
  setBillingDetails: React.Dispatch<React.SetStateAction<BillingDetails>>;
  defaultBillingDetailsValues: BillingDetails;
  readableIdentifier: string;
};

export const PaymentMethodSelector: React.FC<Props> = React.memo(
  ({
    savedPaymentMethodList,
    selectedSavedPaymentMethodId,
    requestSetupIntentSecret,
    refreshSavedPaymentMethodList,
    paymentMethodType,
    loading,
    sepaDefaultName,
    sepaDefaultEmail,
    companyId,
    detachPaymentMethod,
    detachPaymentMethodLoading,
    processing,
    disabled,
    selectPaymentMethod,
    onSuccessTerminal,
    onCancelTerminal,
    stripeReaders,
    setProcessing,
    onlinePaymentEnabled,
    cardBillingDetailsMandatory,
    setAreBillingDetailsProvided,
    areInitialBillingDetailsNecessary,
    setAreInitialBillingDetailsNecessary,
    billingDetails,
    setBillingDetails,
    defaultBillingDetailsValues,
    readableIdentifier,
  }) => {
    const { t } = useTranslation(['invoice']);
    const classes = useStyles();

    const selectedPaymentMethodBillingDetails: BillingDetails =
      React.useMemo(() => {
        if (selectedSavedPaymentMethodId) {
          return cloneDeep(
            savedPaymentMethodList?.find(
              (pm) => pm.id === selectedSavedPaymentMethodId,
            )?.billing_details,
          );
        }
        return defaultBillingDetailsValues;
      }, [
        selectedSavedPaymentMethodId,
        savedPaymentMethodList,
        defaultBillingDetailsValues,
      ]);

    React.useEffect(() => {
      if (selectedSavedPaymentMethodId) {
        setBillingDetails(selectedPaymentMethodBillingDetails);
      } else {
        setBillingDetails(defaultBillingDetailsValues);
      }
    }, [
      selectedSavedPaymentMethodId,
      defaultBillingDetailsValues,
      selectedPaymentMethodBillingDetails,
      setBillingDetails,
    ]);

    const areSpecificBillingDetailsProvided = React.useCallback(
      (specificBillingDetails: BillingDetails) => {
        return (
          !!specificBillingDetails?.name &&
          !!specificBillingDetails?.address.line1 &&
          !!specificBillingDetails?.address.postal_code &&
          !!specificBillingDetails?.address.city &&
          !!specificBillingDetails?.address.country
        );
      },
      [],
    );

    React.useEffect(() => {
      setAreBillingDetailsProvided(
        cardBillingDetailsMandatory &&
          selectedSavedPaymentMethodId &&
          readableIdentifier === MarketplacePaymentMethods.card
          ? areSpecificBillingDetailsProvided(billingDetails)
          : true,
      );
      setAreInitialBillingDetailsNecessary(
        cardBillingDetailsMandatory &&
          selectedSavedPaymentMethodId &&
          readableIdentifier === MarketplacePaymentMethods.card
          ? areSpecificBillingDetailsProvided(
              selectedPaymentMethodBillingDetails,
            )
          : true,
      );
    }, [
      setAreBillingDetailsProvided,
      selectedPaymentMethodBillingDetails,
      selectedSavedPaymentMethodId,
      readableIdentifier,
      areSpecificBillingDetailsProvided,
      cardBillingDetailsMandatory,
      billingDetails,
      setAreInitialBillingDetailsNecessary,
    ]);

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
            areInitialBillingDetailsNecessary={
              areInitialBillingDetailsNecessary
            }
            billingDetails={billingDetails}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory}
            companyId={companyId}
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            disabled={loading || processing || disabled}
            onlinePaymentEnabled={onlinePaymentEnabled}
            onSelect={selectPaymentMethod}
            paymentMethodType={readableIdentifier}
            refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
            requestSetupIntentSecret={requestSetupIntentSecret}
            savedPaymentMethodList={savedPaymentMethodList}
            selectedSavedPaymentMethodId={selectedSavedPaymentMethodId}
            sepaDefaultEmail={sepaDefaultEmail}
            sepaDefaultName={sepaDefaultName}
            setBillingDetails={setBillingDetails}
          />
        )}
        {parseInt(paymentMethodType) === PAYMENT_STRIPE_TERMINAL_FAKE && (
          <div className={classes.terminalContainer}>
            <PaymentStripeTerminalWrapper
              isSetupIntent
              onCancel={onCancelTerminal}
              onSuccess={onSuccessTerminal}
              requestSetupIntentSecret={requestSetupIntentSecret}
              setProcessing={setProcessing}
              stripeReaders={stripeReaders}
            />
          </div>
        )}
      </div>
    );
  },
);

export default PaymentMethodSelector;
