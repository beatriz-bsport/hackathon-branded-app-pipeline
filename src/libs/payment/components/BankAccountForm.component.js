// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { compose, withState, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { injectStripe, Elements, StripeProvider } from 'react-stripe-elements';

import Config from '../../../config';

type Props = {
  company: Company,
  setAccountHolderName: (string) => void,
  account_holder_name: string,
  account_number: string,
  setAccountNumber: (string) => void,
  onSubmit: () => void,
  error: ?Error,
  loading: boolean,
  onClose: () => void,
};

export const BankAccountForm = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  let content = <Typography>{t('bankaccount.form.unknownCountry')}</Typography>;
  if (['FR', 'BE', 'IT', 'DE', 'NL'].includes(props.company.country)) {
    content = (
      <div className={classes.field}>
        <Typography variant="h5" className={classes.title}>
          {t('bankAccount.form.title')}
        </Typography>
        <Typography className={classes.content}>
          {t('bankAccount.form.content')}
        </Typography>
        <TextField
          fullWidth
          className={classes.field}
          label={t('bankAccount.form.accountHolderName.label')}
          placeholder={t('bankAccount.form.accountHolderName.placeholder')}
          required
          variant="outlined"
          value={props.account_holder_name || ''}
          onChange={(ev) => props.setAccountHolderName(ev.target.value)}
        />
        <TextField
          fullWidth
          label={t('bankAccount.form.accountNumber.label')}
          required
          className={classes.field}
          placeholder={t('bankAccount.form.accountNumber.placeholder')}
          variant="outlined"
          value={props.account_number || ''}
          onChange={(ev) => props.setAccountNumber(ev.target.value)}
        />
      </div>
    );
  }
  return (
    <form
      className={classes.container}
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit();
      }}
    >
      {content}
      {props.error && (
        <Typography variant="caption" color="error">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button onClick={props.onClose} disabled={props.loading}>
          {t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button color="primary" type="submit">
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
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
  injectStripe,
  withState('account_number', 'setAccountNumber', ''),
  withState('account_holder_name', 'setAccountHolderName', ''),
  withState('error', 'setError', false),
  withState('loading', 'setLoading', false),
  withHandlers({
    onSubmit: ({
      onSubmit,
      account_number,
      account_holder_name,
      country,
      currency,
      stripe,
      setError,
      onClose,
      setLoading,
    }) => () => {
      stripe
        .createToken('bank_account', {
          account_number,
          account_holder_name,
          country,
          currency,
        })
        .then(({ token }) => {
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

export default (props) => (
  <StripeProvider apiKey={Config.REACT_APP_STRIPE_PK_KEY}>
    <Elements>
      <BankAccountFormComposed {...props} />
    </Elements>
  </StripeProvider>
);
