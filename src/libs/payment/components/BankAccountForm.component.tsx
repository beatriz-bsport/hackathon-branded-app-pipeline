// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { ElementsConsumer, Elements } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import { getStripePkKey } from '../../theme/selectors';
import { LOCALE_LIST } from '../../../components/input/LocaleSelector.component';
import { CompanySetup } from '../types';
import BankAccountFormRegistry from './BankAccountFormRegistry';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  company: CompanySetup;
  onSubmit: () => void;
  error: Error | null;
  loading: boolean;
  onClose: () => void;
  currency: string;
};

export const BankAccountForm = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  let content = <Typography>{t('bankAccount.form.unknownCountry')}</Typography>;

  if (
    LOCALE_LIST.map((l) => l.locale.split('_')[1]).includes(
      props.company.country,
    )
  ) {
    const BankAccountFormBase =
      BankAccountFormRegistry[props.currency] || BankAccountFormRegistry.eur;

    content = (
      <BankAccountFormBase
        currency={props.currency}
        classes={classes}
        onSubmit={props.onSubmit}
        error={props.error}
        loading={props.loading}
        onClose={props.onClose}
      />
    );
  }
  return <div className={classes.container}>{content}</div>;
};

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(2) },
  title: {
    marginBottom: theme.spacing(2),
  },
  content: {
    marginBottom: theme.spacing(1),
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  field: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const BankAccountFormComposed = compose(
  withState('error', 'setError', false),
  withState('loading', 'setLoading', false),
  withHandlers({
    onSubmit:
      ({
        onSubmit,
        country,
        currency,
        stripe,
        setError,
        onClose,
        setLoading,
      }) =>
      (
        account_holder_name: string,
        account_number: string,
        routing_number: string | null,
      ) => {
        setLoading(true);
        stripe
          .createToken('bank_account', {
            account_number,
            account_holder_name,
            country,
            currency,
            ...(routing_number ? { routing_number } : {}),
          })
          .then((r: any) => {
            const { token } = r;

            setLoading(true);
            setError(false);
            onSubmit(token.id, {
              onSuccess: () => {
                onClose();
                setLoading(false);
              },
              onError: () => {
                setLoading(false);
                setError(true);
              },
            });
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
      },
  }),
)(BankAccountForm);

export default (props: Props) => (
  <Elements stripe={stripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <BankAccountFormComposed
          stripe={stripe}
          elements={elements}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
