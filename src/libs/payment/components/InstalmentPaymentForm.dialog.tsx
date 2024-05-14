import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import { compose } from 'recompose';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
} from '@bsport/common/lib/master-data/payment-group';
import { Form } from 'formik';
import Immutable from 'seamless-immutable';
import {
  getCompanyCountry,
  getCurrencyDisplayWithPrice,
} from '../../theme/selectors';
// @ts-expect-error
import { Submit } from '#components/forms';
import InstalmentPaymentForm, {
  InstalPaymentFormHOC,
} from './instalment-payment';
import PaymentMethodTypeSwitcher from './PaymentMethodTypeSwitcher.component';
import PaymentMethodSelector from './PaymentMethodSelector.component';
import type { PaymentInstalmentData, PaymentConfigData } from '../types';
import type { OptionCallback } from '#state/types';
import {
  fromPaymentGroupIdentifierToPaymentMethodIdentifier,
  PAYMENT_STRIPE_TERMINAL_FAKE,
} from '#libs/payment/utils';
import type { StripeReader } from '#libs/terminal/types';
import { updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI } from '#libs/payment/api';
import {
  BillingDetails,
  MarketplacePaymentMethods,
} from '#libs/marketplace/types';

type Props = {
  enabledPaymentGroupMethodIdentifier: Array<number>;
  loading: boolean;
  onSubmit: (
    data: PaymentConfigData & PaymentInstalmentData,
    options: OptionCallback,
  ) => void;
  onClose: () => void;
  enabledPaymentMethods: Array<number>;
  values: PaymentInstalmentData; // comes from the formik HOC
  totalPriceCts: number;
  stripeReaders: StripeReader[];
  requestSetupIntentSecret: () => Promise<any>;
  onlinePaymentEnabled?: boolean;
  companyId: number;
  cardBillingDetailsMandatory?: boolean;
  defaultUserEmail: string;
  defaultUserName: string;
};

const STEP_CONFIG_RECURRENCE = 0;
const STEP_CONFIG_PAYMENT = 1;

const InstalmentPaymentFormDialog = (props: Props) => {
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  const [step, setStep] = React.useState(STEP_CONFIG_RECURRENCE);
  const [data, setData] = React.useState<PaymentInstalmentData>({
    nb_interval: 3,
    recurrence_basis: 1,
    interval: 'week',
    anchor_date: DateTime.now().toISODate(),
  });
  const [processing, setProcessing] = React.useState(false);
  const [paymentConfig, setPaymentConfig] = React.useState<PaymentConfigData>({
    payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    payment_method_id: '',
  });
  const companyCountry = getCompanyCountry();

  const defaultBillingDetailsValues = React.useMemo(() => {
    return Immutable({
      name: props.defaultUserName || '',
      address: {
        city: '',
        country: companyCountry || '',
        line1: '',
        line2: '',
        postal_code: '',
        state: '',
      },
      email: props.defaultUserEmail || '',
    });
  }, [props.defaultUserName, props.defaultUserEmail, companyCountry]);

  const [
    areInitialBillingDetailsNecessary,
    setAreInitialBillingDetailsNecessary,
  ] = React.useState(false);

  const [areBillingDetailsProvided, setAreBillingDetailsProvided] =
    React.useState(false);

  const [billingDetails, setBillingDetails] = React.useState<BillingDetails>(
    defaultBillingDetailsValues,
  );

  const readableIdentifier = React.useMemo(() => {
    return fromPaymentGroupIdentifierToPaymentMethodIdentifier(
      // @ts-ignore
      parseInt(paymentConfig.payment_method),
    );
  }, [paymentConfig.payment_method]);

  const onSubmitSecondStep = async () => {
    if (
      !areInitialBillingDetailsNecessary &&
      readableIdentifier === MarketplacePaymentMethods.card
    ) {
      await updatePaymentMethodBillingDetailsAPI({
        payment_method_id: paymentConfig.payment_method_id,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          address: billingDetails.address,
        },
        // @ts-ignore
        company: parseInt(props.companyId),
      });
    }
    setProcessing(true);
    let updatedPaymentConfig = {};
    if (paymentConfig.payment_method === PAYMENT_STRIPE_TERMINAL_FAKE) {
      updatedPaymentConfig = {
        payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      };
    }
    props.onSubmit(
      {
        ...data,
        ...paymentConfig,
        ...updatedPaymentConfig,
      },
      {
        onError: () => setProcessing(false),
        onSuccess: () => {
          setProcessing(false);
          props.onClose();
        },
      },
    );
  };
  const onCancelSecondStep = () => setStep(STEP_CONFIG_RECURRENCE);

  const selectPaymentMethod = React.useCallback(
    (payment_method_id) => {
      setPaymentConfig({ ...paymentConfig, payment_method_id });
    },
    [paymentConfig],
  );

  if (step === STEP_CONFIG_RECURRENCE) {
    return (
      <Dialog open>
        <DialogTitle>{t('instalment.form.title.scheduler')}</DialogTitle>
        <Form
          // @ts-ignore
          onSubmit={(ev: React.MouseEvent) => {
            ev.preventDefault();
            setData(props.values);
            setStep(STEP_CONFIG_PAYMENT);
          }}
        >
          <DialogContent>
            <div className={classes.priceContainer}>
              <Typography variant="h5">
                {`${getCurrencyDisplayWithPrice(
                  (props.totalPriceCts / 100).toFixed(2),
                )}`}
              </Typography>
            </div>
            <InstalmentPaymentForm {...props} />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>
              {t('instalment.form.actions.close')}
            </Button>
            <Submit color="primary" variant="outlined">
              {t('instalment.form.actions.next')}
            </Submit>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
  if (step === STEP_CONFIG_PAYMENT) {
    return (
      <Dialog open>
        <DialogTitle>{t('instalment.form.title.payment')}</DialogTitle>
        <DialogContent>
          <div className={classes.priceContainer}>
            <Typography variant="h5">
              {`${getCurrencyDisplayWithPrice(
                (props.totalPriceCts / 100).toFixed(2),
              )}`}
            </Typography>
          </div>
          <PaymentMethodTypeSwitcher
            classes={classes}
            disabled={processing || props.loading}
            enabledPaymentGroupMethodIdentifier={
              props.enabledPaymentGroupMethodIdentifier
            }
            onChange={(payment_method) => {
              setPaymentConfig({
                payment_method,
                payment_method_id:
                  payment_method === PAYMENT_STRIPE_TERMINAL_FAKE
                    ? 'stripe_terminal'
                    : '',
              });
            }}
            onlinePaymentEnabled={props.onlinePaymentEnabled}
            // @ts-ignore
            payment_method={paymentConfig.payment_method}
          />
          <Divider />
          <PaymentMethodSelector
            areInitialBillingDetailsNecessary={
              areInitialBillingDetailsNecessary
            }
            billingDetails={billingDetails}
            cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
            companyId={props.companyId}
            defaultBillingDetailsValues={defaultBillingDetailsValues}
            disabled={
              processing ||
              props.loading ||
              props.onlinePaymentEnabled === false
            }
            onCancelTerminal={onCancelSecondStep}
            onlinePaymentEnabled={props.onlinePaymentEnabled}
            onSuccessTerminal={onSubmitSecondStep}
            // @ts-ignore
            paymentMethodType={paymentConfig.payment_method}
            readableIdentifier={readableIdentifier}
            // @ts-ignore
            refreshSavedPaymentMethodList={props.fetchPaymentMethodList}
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            // @ts-ignore
            savedPaymentMethodList={props.savedPaymentMethodList}
            selectedSavedPaymentMethodId={paymentConfig.payment_method_id}
            selectPaymentMethod={selectPaymentMethod}
            setAreBillingDetailsProvided={setAreBillingDetailsProvided}
            setAreInitialBillingDetailsNecessary={
              setAreInitialBillingDetailsNecessary
            }
            setBillingDetails={setBillingDetails}
            setProcessing={setProcessing}
            stripeReaders={props.stripeReaders}
          />
        </DialogContent>
        {paymentConfig.payment_method !== PAYMENT_STRIPE_TERMINAL_FAKE && (
          <DialogActions>
            <Button onClick={onCancelSecondStep}>
              {t('instalment.form.actions.previous')}
            </Button>
            <Button
              color="primary"
              disabled={
                processing ||
                props.loading ||
                (paymentConfig.payment_method !==
                  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT &&
                  !paymentConfig.payment_method_id) ||
                !areBillingDetailsProvided
              }
              onClick={onSubmitSecondStep}
              variant="contained"
            >
              {(processing || props.loading) && <CircularProgress />}
              {t('instalment.form.actions.submit')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
  return <div />;
};

const useStyles = makeStyles((theme) => ({
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// @ts-ignore
export default compose(InstalPaymentFormHOC)(InstalmentPaymentFormDialog);
