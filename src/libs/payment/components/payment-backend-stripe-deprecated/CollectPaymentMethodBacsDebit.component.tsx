import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import {
  loadStripe,
  SetupIntentResult,
  Stripe,
  StripeElements,
} from '@stripe/stripe-js';

import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import { Form, ErrorMessage, Formik } from 'formik';

import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';

import { AxiosResponse } from 'axios';
import { makeStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';
import { TFunction } from 'i18next';
// @ts-expect-error
import { TextField } from '#components/forms';
import LocaleSelector from '#components/input/LocaleSelector.component';
import type { StripeInit } from '#libs/payment/types';
import { getStripePkKey } from '../../../theme/selectors';
// @ts-expect-error
import StripeErrorCode from './StripeErrorCode.component';

const Wrapper = ({
  children,
  variant,
}: {
  children: ReactElement;
  variant: string;
}) => {
  if (variant === 'div') {
    return <div>{children}</div>;
  }
  return <Modal open>{children}</Modal>;
};

const BacsDebitFormSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().required(),
  country: Yup.string().length(2).required(),
  line1: Yup.string().required(),
  line2: Yup.string(),
  city: Yup.string().required(),
  postal_code: Yup.string().required(),
  sortCode: Yup.string()
    .length(6)
    .matches(/^[0-9]+$/)
    .required(),
  accountNumber: Yup.string()
    .matches(/^[0-9]+$/)
    .required(),
});

export interface FormikValues {
  name?: string;
  email?: string;
  country?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  sortCode?: string;
  accountNumber?: string;
}

interface BacsDebitFormProps {
  classes: ClassNameMap<'actions' | 'centered' | 'message' | 'mandate'>;
  handleFormSubmit: (values: FormikValues) => void;
  labelClose: string;
  onClose?: () => void;
  processing: boolean;
  t: TFunction;
  userDefaultName?: string;
  userDefaultEmail?: string;
}

const BacsDebitForm = ({
  classes,
  handleFormSubmit,
  labelClose,
  onClose,
  processing,
  t,
  userDefaultName,
  userDefaultEmail,
}: BacsDebitFormProps) => {
  const onSubmitCallback = useCallback(
    (values, actions) => {
      setTimeout(() => {
        handleFormSubmit(values);
        actions.setSubmitting(false);
      }, 1000);
    },
    [handleFormSubmit],
  );

  return (
    <Formik
      initialValues={{
        email: userDefaultEmail,
        name: userDefaultName,
        country: 'GB',
        sortCode: '',
        accountNumber: '',
        city: '',
        line1: '',
        line2: '',
        postal_code: '',
      }}
      onSubmit={onSubmitCallback}
      validationSchema={BacsDebitFormSchema}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField label={t('subscription:mandate.email')} name="email" />
          <TextField label={t('subscription:mandate.name')} name="name" />
          <LocaleSelector
            distinctCountry
            hideLang
            // noMargin
            defaultValue="GB"
            label={t('translation:form.address.country')}
            onChange={(ev) => {
              // @ts-expect-error
              setFieldValue('country', ev.target.value);
            }}
            value={values.country}
            valueKey="country"
          />
          <TextField
            label={t('translation:form.address.addressLine1')}
            name="line1"
          />
          <TextField
            label={t('translation:form.address.addressLine2')}
            name="line2"
          />
          <TextField label={t('translation:form.address.city')} name="city" />
          <TextField
            label={t('translation:form.address.zipcode')}
            name="postal_code"
          />
          <TextField
            label={t('subscription:mandate.sortCode')}
            name="sortCode"
          />
          <ErrorMessage name="sortCode">
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
          <TextField
            label={t('subscription:mandate.accountNumber')}
            name="accountNumber"
          />
          <ErrorMessage name="accountNumber">
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
          <div className={classes.mandate}>
            <Typography color="textSecondary">
              {t('subscription:mandate.contentBacsDebit')}
            </Typography>
          </div>
          <div className={classes.actions}>
            {!!onClose && (
              <Button disabled={processing} onClick={onClose}>
                {labelClose || t('forms.paymentMethod.actions.close')}
              </Button>
            )}
            <Button color="primary" disabled={processing} type="submit">
              {t('forms.paymentMethod.actions.collect')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {
  fullScreen: boolean;
  t: TFunction;
  onClose?: () => void;
  onSuccess: (stripeSetupIntentCallResult: SetupIntentResult) => void;
  requestSetupIntentSecret: () => Promise<AxiosResponse<any>>;
  stripe: Stripe;
  elements: StripeElements;
  variant?: 'div' | 'modal';
  content?: string;
  labelClose?: string;
  userDefaultName?: string;
  userDefaultEmail?: string;
};

const CollectPaymentMethodBacsDebit = ({
  content,
  elements,
  fullScreen,
  labelClose,
  onClose,
  onSuccess,
  requestSetupIntentSecret,
  stripe,
  t,
  userDefaultEmail,
  userDefaultName,
  variant,
}: Props) => {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [stripeErrorCode, setStripeErrorCode] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [clientSecret, setClientSecret] = React.useState(null);

  const handleRetry = () => {
    setError(null);
    setStripeErrorCode(null);
    setSuccess(null);
  };

  useEffect(() => {
    async function fetchClientSecret() {
      try {
        const result = await requestSetupIntentSecret();
        setClientSecret(result.data.client_secret);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    fetchClientSecret();
  }, [requestSetupIntentSecret]);

  const handleFormSubmit = async (values: FormikValues) => {
    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }
    setProcessing(true);

    const result = await stripe.confirmBacsDebitSetup(clientSecret, {
      payment_method: {
        bacs_debit: {
          sort_code: values.sortCode,
          account_number: values.accountNumber,
        },
        billing_details: {
          address: {
            line1: values.line1,
            line2: values.line2,
            country: values.country,
            city: values.city,
            postal_code: values.postal_code,
          },
          email: values.email,
          name: values.name,
        },
      },
    });

    if (result.error) {
      setError(true);
      setStripeErrorCode((result.error && result.error.code) || null);
    } else {
      setSuccess(true);
      if (onSuccess) onSuccess(result);
    }
    setProcessing(false);
  };

  const dialogOffset = fullScreen ? '0%' : '50%';

  return (
    <Wrapper variant={variant}>
      {/* This fragment is important for compability with 3d secure, please do not delete */}
      <>
        <div
          className={classes.modal}
          style={
            variant === 'div'
              ? { position: 'unset', backgroundColor: 'transparent' }
              : {
                  transform: `translate(-${dialogOffset}, -${dialogOffset})`,
                  top: dialogOffset,
                  left: dialogOffset,
                }
          }
        >
          <DialogTitle id="collectPaymentMethodTitle">
            {t('forms.paymentMethod.collect.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {content || t('forms.paymentMethod.collect.content')}
            </DialogContentText>
            <div>
              {processing && (
                <div className={classes.centered}>
                  <CircularProgress />
                </div>
              )}
              {success && (
                <div>
                  <div className={classes.centered}>
                    <CheckIcon
                      color="primary"
                      style={{ height: 100, width: 100 }}
                    />
                    <Typography className={classes.message}>
                      {t('forms.paymentMethod.message.success')}
                    </Typography>
                  </div>
                  <div className={classes.actions}>
                    {!!onClose && (
                      <Button onClick={onClose}>
                        {labelClose || t('forms.paymentMethod.actions.close')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {error && (
                <div>
                  <div className={classes.centered}>
                    <ErrorIcon
                      color="secondary"
                      style={{ height: 100, width: 100 }}
                    />
                    <Typography className={classes.message}>
                      {t('forms.paymentMethod.message.error')}
                    </Typography>
                    {stripeErrorCode && (
                      <StripeErrorCode errorCode={stripeErrorCode} />
                    )}
                  </div>
                  <div className={classes.actions}>
                    {!!onClose && (
                      <Button onClick={onClose}>
                        {labelClose || t('forms.paymentMethod.actions.close')}
                      </Button>
                    )}
                    <Button onClick={handleRetry}>
                      {t('forms.paymentMethod.actions.retry')}
                    </Button>
                  </div>
                </div>
              )}
              {!error && !success && (
                <BacsDebitForm
                  classes={classes}
                  handleFormSubmit={handleFormSubmit}
                  labelClose={labelClose}
                  onClose={onClose}
                  processing={processing}
                  t={t}
                  userDefaultEmail={userDefaultEmail}
                  userDefaultName={userDefaultName}
                />
              )}
            </div>
          </DialogContent>
        </div>
      </>
    </Wrapper>
  );
};

const fallbackStripePromise = loadStripe(getStripePkKey());

const useStyles = makeStyles((theme) => ({
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centered: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  mandate: {
    padding: theme.spacing(2),
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    overflow: 'auto',
    maxHeight: '100vh',
  },
}));

const CollectPaymentMethodCompose = compose<any, Omit<Props, 't'>>(
  withTranslation(['payment']),
)(CollectPaymentMethodBacsDebit);

export default (
  props: Omit<Props, 't' | 'stripe' | 'elements'> & {
    stripePromise?: StripeInit;
  },
) => (
  <Elements stripe={props.stripePromise ?? fallbackStripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CollectPaymentMethodCompose
          elements={elements}
          stripe={stripe}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
