import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB } from '@bsport/common/lib/master-data/subscription-payment-methods.js';
import { AxiosResponse } from 'axios';
import { Skeleton } from '@material-ui/lab';
import AddPaymentMethod from '#src/libs/payment/components/AddPaymentMethod.component';
import { PaymentMethod } from '#src/libs/payment/types';
import { PaymentMethodListItem } from '#src/libs/payment/components/PaymentMethodListItem.component';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';
import { buildSteps } from './utils';
import InfoBox from './InfoBox.component';
import SuccessBox from './SuccessBox.component';

type OwnProps = {
  memberEmail: string;
  memberName: string;
  goNext: () => void;
  goPrevious: () => void;
  requestSetupIntentSecret: () => Promise<AxiosResponse<any>>;
  paymentMethodRegistered: PaymentMethod;
  paymentMethodLoading: boolean;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
  onPaymentMethodSuccess: () => void;
  cardBillingDetailsMandatory: boolean;
};
type Props = OwnProps;

export const AccountConfigurationPaymentMethodStep: React.FC<Props> = ({
  memberName,
  memberEmail,
  goNext,
  goPrevious,
  onPaymentMethodSuccess,
  requestSetupIntentSecret,
  paymentMethodRegistered,
  paymentMethodLoading,
  has_no_need_for_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
  cardBillingDetailsMandatory,
}) => {
  const { t } = useTranslation(['login', 'common']);
  const classes = useStyles();
  const steps = React.useMemo(() => {
    return buildSteps({
      has_no_need_for_stripe_configuration,
      has_visited_stripe_configuration: true,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: true,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: true,
      has_visited_invoice_numbering_step: false,
      no_last_step: false,
      has_visited_last_step: false,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);
  return (
    <>
      <div className={classes.content}>
        <AccountConfigurationStepper
          className={classes.stepper}
          steps={steps}
        />
        <Typography variant="h4">
          {t('accountConfiguration.paymentMethodTitle')}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('accountConfiguration.paymentMethodExplain')}
        </Typography>
        {!paymentMethodRegistered && !paymentMethodLoading && (
          <div className={classes.addPaymentMethod}>
            <AddPaymentMethod
              cardBillingDetailsMandatory={cardBillingDetailsMandatory}
              enabledPaymentMethods={[BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]}
              labelClose={t('common:previous')}
              onCancel={goPrevious}
              onSuccess={onPaymentMethodSuccess}
              requestSetupIntentSecret={requestSetupIntentSecret}
              sepaDefaultEmail={memberEmail}
              sepaDefaultName={memberName}
            />
          </div>
        )}
        {paymentMethodLoading && <Skeleton height={120} variant="rect" />}
        <PaymentMethodListItem paymentMethod={paymentMethodRegistered} />
        {paymentMethodRegistered && (
          <SuccessBox
            content={t('accountConfiguration.paymentMethodSuccess')}
          />
        )}
        <InfoBox />
        {paymentMethodRegistered && (
          <div className={classes.action}>
            {goPrevious && (
              <Button onClick={goPrevious}>{t('common:previous')}</Button>
            )}
            <Button
              color="primary"
              disabled={!paymentMethodRegistered}
              onClick={goNext}
              variant="contained"
            >
              {t('common:next')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  stepper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingBottom: theme.spacing(4),
      marginBottom: 'unset',
    },
  },
  addPaymentMethod: {
    '& #collectPaymentMethodTitle': { display: 'none' },
    '& #collectPaymentMethodCardDialogTitle': { display: 'none' },
    '& #collectPaymentMethodCardDialogContentText': { display: 'none' },
    '& #collectPaymentMethodCardDialogContent': {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
    '& #collectPaymentMethodCardSensitiveData': {
      minWidth: 'unset',
      maxWidth: 'unset',
    },
  },
  subtitle: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },

  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },

  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    marginTop: theme.spacing(20),
    marginLeft: '20%',
    marginRight: '20%',
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
      backgroundColor: 'unset',
      boxShadow: 'unset',
      marginLeft: '4px',
      marginRight: '4px',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(10),
    },
  },
}));
export default AccountConfigurationPaymentMethodStep;
