import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Form, type FormikProps, withFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group.js';
import PaymentMethodMultiSelector from '#src/libs/payment/components/PaymentMethodMultiSelector.component';
import NumericInput from '#src/components/input/NumericInput.component';
import type { StripeDomainListState } from '#src/libs/payment/types';

import { addOrRemove } from './utils';
import { validationSchema } from './validationSchema';
import { MAX_DAYS_FIRST_WARNING_PAYMENT_METHOD_EXPIRATION } from './constants';
import StripeDomainManagement from './StripeDomainManagement.component';

export type PaymentMethodsFormValues = {
  payment_method_available: number[];
  payment_method_available_basket: number[];
  payment_method_available_subscription: number[];
  payment_method_available_recurringly: number[];
  cardBillingDetailsMandatory: boolean;
  first_warning_payment_method_expiration_days: number;
  second_warning_payment_method_expiration_days: number;
};

type AdditionalProps = {
  updateLoading: boolean;
  disablePaymentExpiredFirstWarning: boolean;
  disablePaymentExpiredSecondWarning: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    values: Omit<PaymentMethodsFormValues, 'cardBillingDetailsMandatory'> & {
      force_billing_details_on_cards: boolean;
    },
  ) => void;
  stripeDomainList: StripeDomainListState;
  onRegisterStripeDomain: (domainName: string, onSuccess?: () => void) => void;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
  basketContainer: {
    marginTop: theme.spacing(2),
  },
  subscriptionContainer: {
    marginTop: theme.spacing(2),
  },
  threeDSecureContainer: {
    marginTop: theme.spacing(3),
  },
  daysInputsContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  selectorContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-1),
  },
  leftIcon: {
    margin: theme.spacing(1),
    icon: {
      textAlign: 'center',
    },
  },
  daysInput: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '400px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const PaymentMethodsForm: React.FC<
  AdditionalProps & FormikProps<PaymentMethodsFormValues>
> = ({
  values: {
    payment_method_available,
    payment_method_available_basket,
    payment_method_available_subscription,
    payment_method_available_recurringly,
    cardBillingDetailsMandatory,
    first_warning_payment_method_expiration_days,
    second_warning_payment_method_expiration_days,
  },
  disablePaymentExpiredFirstWarning,
  disablePaymentExpiredSecondWarning,
  errors,
  isValid,
  setFieldValue,
  updateLoading,
  handleSubmit,
  stripeDomainList,
  onRegisterStripeDomain,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['settings', 'common']);

  const onBasketMethodChange = React.useCallback(
    (id: number) => {
      const updatedBasket = addOrRemove(payment_method_available_basket, id);
      setFieldValue('payment_method_available_basket', updatedBasket);
    },
    [payment_method_available_basket, setFieldValue],
  );

  const onSubscriptionMethodsChange = React.useCallback(
    (id: number) => {
      const updatedSubscription = addOrRemove(
        payment_method_available_subscription,
        id,
      );
      setFieldValue(
        'payment_method_available_subscription',
        updatedSubscription,
      );
    },
    [payment_method_available_subscription, setFieldValue],
  );

  const onCardBillingDetailsMandatoryChange = React.useCallback(() => {
    setFieldValue('cardBillingDetailsMandatory', !cardBillingDetailsMandatory);
  }, [cardBillingDetailsMandatory, setFieldValue]);

  const onDaysBeforeFirstNotificationChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setFieldValue('first_warning_payment_method_expiration_days', newValue);
    },
    [setFieldValue],
  );

  const onDaysBeforeSecondNotificationChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setFieldValue('second_warning_payment_method_expiration_days', newValue);
    },
    [setFieldValue],
  );

  const formSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit();
    },
    [handleSubmit],
  );

  const daysBeforeFirstNotificationErrorMessage =
    errors?.first_warning_payment_method_expiration_days
      ? t(errors.first_warning_payment_method_expiration_days, {
          maxDays: MAX_DAYS_FIRST_WARNING_PAYMENT_METHOD_EXPIRATION,
        })
      : '';
  const daysBeforeSecondNotificationErrorMessage =
    errors?.second_warning_payment_method_expiration_days
      ? t(errors.second_warning_payment_method_expiration_days)
      : '';

  return (
    <Form noValidate onSubmit={formSubmit}>
      <Typography className={classes.title} variant="h5">
        {t('paymentMethods.title')}
      </Typography>
      <Typography color="textSecondary">
        {t('paymentMethods.subtitle')}
      </Typography>
      <Typography color="textSecondary">
        {t('paymentMethods.subtitle2')}
      </Typography>

      <div className={classes.basketContainer}>
        <Typography variant="h6">
          {t('paymentMethods.methodPaymentBasket')}
        </Typography>
        <div className={classes.row}>
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.methodPaymentBasketHelper')}
          </Typography>
        </div>
        <div className={classes.selectorContainer}>
          <PaymentMethodMultiSelector
            disabled={[PAYMENT_GROUP_METHOD_IDENTIFIER_CB]}
            paymentMethodChoices={payment_method_available}
            paymentMethodsSelected={payment_method_available_basket}
            selectPaymentMethod={onBasketMethodChange}
          />
        </div>
      </div>

      <div className={classes.subscriptionContainer}>
        <Typography variant="h6">
          {t('paymentMethods.methodPaymentSubscription')}
        </Typography>
        <div className={classes.row}>
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.methodPaymentSubscriptionHelper')}
          </Typography>
        </div>
        <div className={classes.selectorContainer}>
          <PaymentMethodMultiSelector
            paymentMethodChoices={payment_method_available_recurringly}
            paymentMethodsSelected={payment_method_available_subscription}
            selectPaymentMethod={onSubscriptionMethodsChange}
          />
          {errors.payment_method_available_subscription && (
            <Typography color="error">
              {t('paymentMethods.methodPaymentSubscriptionError')}
            </Typography>
          )}
        </div>
      </div>

      <div className={classes.daysInputsContainer}>
        <Typography variant="h6">
          {t('paymentMethods.DaysBeforeNotificationInputs.title')}
        </Typography>
        <div className={classes.row}>
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.DaysBeforeNotificationInputs.helpText')}
          </Typography>
        </div>
        <NumericInput
          disabled={disablePaymentExpiredFirstWarning}
          error={!!daysBeforeFirstNotificationErrorMessage}
          helperText={daysBeforeFirstNotificationErrorMessage}
          inputClass={classes.daysInput}
          InputProps={{}}
          label={t(
            'paymentMethods.DaysBeforeNotificationInputs.labels.daysBeforeFirstNotification',
          )}
          onChange={onDaysBeforeFirstNotificationChange}
          value={first_warning_payment_method_expiration_days}
        />
        <NumericInput
          disabled={disablePaymentExpiredSecondWarning}
          error={!!daysBeforeSecondNotificationErrorMessage}
          helperText={daysBeforeSecondNotificationErrorMessage}
          inputClass={classes.daysInput}
          InputProps={{}}
          label={t(
            'paymentMethods.DaysBeforeNotificationInputs.labels.daysBeforeSecondNotification',
          )}
          onChange={onDaysBeforeSecondNotificationChange}
          value={second_warning_payment_method_expiration_days}
        />
      </div>

      <div className={classes.threeDSecureContainer}>
        <Typography variant="h6">
          {t('paymentMethods.methodPaymentCardBillingDetailsTitle')}
        </Typography>
        <div className={classes.row}>
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.methodPaymentCardBillingDetailsHelper')}
          </Typography>
        </div>
        <div className={classes.row}>
          <Switch
            checked={cardBillingDetailsMandatory}
            onChange={onCardBillingDetailsMandatoryChange}
          />
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.methodPaymentCardBillingDetails')}
          </Typography>
        </div>
      </div>

      <StripeDomainManagement
        onRegisterDomain={onRegisterStripeDomain}
        stripeDomainList={stripeDomainList}
      />

      {updateLoading && <LinearProgress className={classes.fullWidth} />}

      <div className={classes.saveButtonContainer}>
        <Button
          color="primary"
          disabled={updateLoading || !isValid}
          type="submit"
          variant="contained"
        >
          {t('paymentMethods.save')}
        </Button>
      </div>
    </Form>
  );
};

const formikFormWrapper = withFormik<
  PaymentMethodsFormValues & AdditionalProps,
  PaymentMethodsFormValues
>({
  mapPropsToValues: ({
    payment_method_available_basket,
    payment_method_available_subscription,
    payment_method_available_recurringly,
    cardBillingDetailsMandatory,
    payment_method_available,
    second_warning_payment_method_expiration_days,
    first_warning_payment_method_expiration_days,
  }) => {
    return {
      payment_method_available_basket,
      payment_method_available_subscription,
      cardBillingDetailsMandatory,
      payment_method_available_recurringly,
      payment_method_available,
      first_warning_payment_method_expiration_days,
      second_warning_payment_method_expiration_days,
    };
  },
  handleSubmit: (data, { props: { onSubmit } }) => {
    const sanitizedData = {
      ...omit(data, 'cardBillingDetailsMandatory'),
      force_billing_details_on_cards: data.cardBillingDetailsMandatory,
    };
    onSubmit(sanitizedData);
  },
  validationSchema,
});

export default formikFormWrapper(React.memo(PaymentMethodsForm));
