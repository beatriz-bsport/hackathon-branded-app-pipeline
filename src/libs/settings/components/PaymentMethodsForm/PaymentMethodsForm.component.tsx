import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import InfoOutlineIcon from '@material-ui/icons/Info';

import { Alert } from '@material-ui/lab';
import { withFormik, type FormikProps, Form } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group';
import PaymentMethodMultiSelector from '#libs/payment/components/PaymentMethodMultiSelector.component';
import { addOrRemove } from './utils';

import { validationSchema } from './validationSchema';

export type PaymentMethodsFormValues = {
  payment_method_available: number[];
  payment_method_available_basket: number[];
  payment_method_available_subscription: number[];
  payment_method_available_recurringly: number[];
  cardBillingDetailsMandatory: boolean;
};

type AdditionalProps = {
  updateLoading: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (values: PaymentMethodsFormValues) => void;
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
    marginTop: theme.spacing(2),
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
  },
  errors,
  isValid,
  setFieldValue,
  updateLoading,
  handleSubmit,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

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

  const formSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit();
    },
    [handleSubmit],
  );

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
          <InfoOutlineIcon className={classes.leftIcon} />
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
          <InfoOutlineIcon className={classes.leftIcon} />
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

      <div className={classes.threeDSecureContainer}>
        <Typography variant="h6">
          {t('paymentMethods.methodPaymentCardBillingDetailsTitle')}
        </Typography>
        <div className={classes.row}>
          <Switch
            checked={cardBillingDetailsMandatory}
            onChange={onCardBillingDetailsMandatoryChange}
          />
          <Typography color="textSecondary" variant="body2">
            {t('paymentMethods.methodPaymentCardBillingDetails')}
          </Typography>
        </div>
        <div className={classes.row}>
          <Alert className={classes.leftIcon} severity="info">
            {t('paymentMethods.methodPaymentCardBillingDetailsHelper')}
          </Alert>
        </div>
      </div>

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
  }) => {
    return {
      payment_method_available_basket,
      payment_method_available_subscription,
      cardBillingDetailsMandatory,
      payment_method_available_recurringly,
      payment_method_available,
    };
  },
  handleSubmit: (data, { props: { onSubmit } }) => {
    onSubmit(data);
  },
  validationSchema,
});

export default formikFormWrapper(React.memo(PaymentMethodsForm));
