import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import LocaleSelector from '#src/components/input/LocaleSelector.component';

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

type Props = {
  onSubmit: (
    account_holder_name: string,
    account_number: string,
    routingNumber?: string,
    // @ts-expect-error
    country: string,
  ) => void;
  error: Error | null;
  loading: boolean;
  onClose: () => void;
  labelOnClose: string;
};

const EuropeanBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label="IBAN"
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={!account_holder_name || !account_number}
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                undefined,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const CanadaBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [institutionNumber, setInstitutionNumber] = React.useState('');
  const [transitNumber, setTransitNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.transitNumber.label')}
        onChange={(ev) => setTransitNumber(ev.target.value)}
        placeholder={t('bankAccount.form.transitNumber.placeholder')}
        value={transitNumber}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.institutionNumber.label')}
        onChange={(ev) => setInstitutionNumber(ev.target.value)}
        placeholder={t('bankAccount.form.institutionNumber.placeholder')}
        value={institutionNumber}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          noMargin
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
          // @ts-expect-error
          variant="outlined"
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !!(
                !account_holder_name ||
                !account_number ||
                !institutionNumber ||
                !transitNumber
              )
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${transitNumber}${institutionNumber}`,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const USABankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [routingNumber, setRoutingNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.routingNumber.label')}
        onChange={(ev) => setRoutingNumber(ev.target.value)}
        placeholder={t('bankAccount.form.routingNumber.placeholder')}
        value={routingNumber}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !!(!account_holder_name || !account_number || !routingNumber)
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                routingNumber,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const MexicoBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label="CLABE"
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder="123456789012345678"
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={!account_holder_name || !account_number || props.loading}
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                undefined,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const AustraliaBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [routingNumber, setRoutingNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label="BSB"
        onChange={(ev) => setRoutingNumber(ev.target.value)}
        placeholder="123456"
        value={routingNumber}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !routingNumber ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                routingNumber,

                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const BrazilBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [bankCode, setBankCode] = React.useState('');
  const [branchCode, setBranchCode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.bankCode.label')}
        onChange={(ev) => setBankCode(ev.target.value)}
        placeholder={t('bankAccount.form.bankCode.placeholder')}
        value={bankCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        onChange={(ev) => setBranchCode(ev.target.value)}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        value={branchCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !branchCode ||
              !bankCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${bankCode}${branchCode}`,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const HongKongBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [clearingCode, setClearingCode] = React.useState('');
  const [branchCode, setBranchCode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.clearingCode.label')}
        onChange={(ev) => setClearingCode(ev.target.value)}
        placeholder={t('bankAccount.form.clearingCode.placeholder')}
        value={clearingCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        onChange={(ev) => setBranchCode(ev.target.value)}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        value={branchCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !branchCode ||
              !clearingCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${clearingCode}-${branchCode}`,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const IndiaBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [ifscCode, setIfscCode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label="IFSC Code"
        onChange={(ev) => setIfscCode(ev.target.value)}
        placeholder="HDFC0004051"
        value={ifscCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !ifscCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                ifscCode,

                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const MalaysiaBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={!account_holder_name || !account_number || props.loading}
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                undefined,

                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const NewZealandBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder="xx-xxxx-xxxxxxx-xxx"
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={!account_holder_name || !account_number || props.loading}
            onClick={() =>
              // @ts-expect-error
              props.onSubmit(
                account_holder_name,
                account_number,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

const SingapourBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [bankCode, setBankCode] = React.useState('');
  const [branchCode, setBranchCode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.bankCode.label')}
        onChange={(ev) => setBankCode(ev.target.value)}
        placeholder={t('bankAccount.form.bankCode.placeholder')}
        value={bankCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        onChange={(ev) => setBranchCode(ev.target.value)}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        value={branchCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !bankCode ||
              !branchCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${bankCode}-${branchCode}`,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};
const UnitedKingdomBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const [sortCode, setSortCode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const { t } = useTranslation(['payment', 'login']);
  const classes = useStyles();
  return (
    <div className={classes.field}>
      <Typography className={classes.title} id="bankAccountTitle" variant="h5">
        {t('bankAccount.form.title')}
      </Typography>
      <Typography className={classes.content} id="bankAccountContent">
        {t('bankAccount.form.content')}
      </Typography>
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountHolderName.label')}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
        placeholder={t('bankAccount.form.accountHolderName.placeholder')}
        value={account_holder_name || ''}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.sortCode.label')}
        onChange={(ev) => setSortCode(ev.target.value)}
        placeholder={t('bankAccount.form.sortCode.placeholder')}
        value={sortCode}
        variant="outlined"
      />
      <TextField
        fullWidth
        required
        className={classes.field}
        label={t('bankAccount.form.accountNumber.label')}
        onChange={(ev) => setAccountNumber(ev.target.value)}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        value={account_number || ''}
        variant="outlined"
      />
      <div style={{ marginTop: 8 }}>
        <LocaleSelector
          distinctCountry
          hideLang
          required
          label={`${t('login:signupCompany.form.country.label')}*`}
          // @ts-expect-error
          onChange={(ev) => setCountry(ev.target.value)}
          value={country}
        />
      </div>
      {props.error && (
        <Typography color="error" variant="caption">
          {t('bankAccount.form.invalid')}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button disabled={props.loading} onClick={props.onClose}>
          {props.labelOnClose || t('bankAccount.form.actions.cancel')}
        </Button>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !sortCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                sortCode,
                country.slice(3, 5),
              )
            }
          >
            {t('bankAccount.form.actions.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

export const BankAccountFormRegistry = {
  eur: EuropeanBankAccount,
  usd: USABankAccount,
  chf: EuropeanBankAccount,
  nok: EuropeanBankAccount,
  dkk: EuropeanBankAccount,
  aed: EuropeanBankAccount,
  cad: CanadaBankAccount,
  sek: EuropeanBankAccount,
  mxn: MexicoBankAccount,
  aud: AustraliaBankAccount,
  bgn: EuropeanBankAccount,
  brl: BrazilBankAccount,
  czk: EuropeanBankAccount,
  myr: MalaysiaBankAccount,
  hkd: HongKongBankAccount,
  inr: IndiaBankAccount,
  nzd: NewZealandBankAccount,
  pln: EuropeanBankAccount,
  ron: EuropeanBankAccount,
  sgd: SingapourBankAccount,
  gbp: UnitedKingdomBankAccount,
};

export default BankAccountFormRegistry;
