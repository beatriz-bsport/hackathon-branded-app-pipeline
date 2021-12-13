import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

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
  ) => void;
  error: Error | null;
  loading: boolean;
  onClose: () => void;
};

const EuropeanBankAccount = (props: Props) => {
  const [account_holder_name, setAccountHolderName] = React.useState('');
  const [account_number, setAccountNumber] = React.useState('');
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        label="IBAN"
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={!account_holder_name || !account_number}
            onSubmit={() => props.onSubmit(account_holder_name, account_number)}
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.transitNumber.label')}
        placeholder={t('bankAccount.form.transitNumber.placeholder')}
        required
        variant="outlined"
        value={transitNumber}
        onChange={(ev) => setTransitNumber(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.institutionNumber.label')}
        placeholder={t('bankAccount.form.institutionNumber.placeholder')}
        required
        variant="outlined"
        value={institutionNumber}
        onChange={(ev) => setInstitutionNumber(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !!(!account_holder_name || !account_number || institutionNumber)
            }
            onSubmit={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${transitNumber}${institutionNumber}`,
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.routingNumber.label')}
        placeholder={t('bankAccount.form.routingNumber.placeholder')}
        required
        variant="outlined"
        value={routingNumber}
        onChange={(ev) => setRoutingNumber(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !!(!account_holder_name || !account_number || !routingNumber)
            }
            onClick={() =>
              props.onSubmit(account_holder_name, account_number, routingNumber)
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        label="CLABE"
        required
        className={classes.field}
        placeholder="123456789012345678"
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            disabled={!account_holder_name || !account_number || props.loading}
            color="primary"
            onClick={() => props.onSubmit(account_holder_name, account_number)}
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label="BSB"
        placeholder="123456"
        required
        variant="outlined"
        value={routingNumber}
        onChange={(ev) => setRoutingNumber(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !routingNumber ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(account_holder_name, account_number, routingNumber)
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.bankCode.label')}
        placeholder={t('bankAccount.form.bankCode.placeholder')}
        required
        variant="outlined"
        value={bankCode}
        onChange={(ev) => setBankCode(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        required
        variant="outlined"
        value={branchCode}
        onChange={(ev) => setBranchCode(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !branchCode ||
              !bankCode ||
              props.loading
            }
            onSubmit={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${bankCode}${branchCode}`,
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.clearingCode.label')}
        placeholder={t('bankAccount.form.clearingCode.placeholder')}
        required
        variant="outlined"
        value={clearingCode}
        onChange={(ev) => setClearingCode(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        required
        variant="outlined"
        value={branchCode}
        onChange={(ev) => setBranchCode(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !branchCode ||
              !clearingCode ||
              props.loading
            }
            onSubmit={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${clearingCode}-${branchCode}`,
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label="IFSC Code"
        placeholder="HDFC0004051"
        required
        variant="outlined"
        value={ifscCode}
        onChange={(ev) => setIfscCode(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !ifscCode ||
              props.loading
            }
            onSubmit={() =>
              props.onSubmit(account_holder_name, account_number, ifscCode)
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            onSubmit={() => props.onSubmit(account_holder_name, account_number)}
            disabled={!account_holder_name || !account_number || props.loading}
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder="xx-xxxx-xxxxxxx-xxx"
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            onSubmit={() => props.onSubmit(account_holder_name, account_number)}
            disabled={!account_holder_name || !account_number || props.loading}
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.bankCode.label')}
        placeholder={t('bankAccount.form.bankCode.placeholder')}
        required
        variant="outlined"
        value={bankCode}
        onChange={(ev) => setBankCode(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.branchCode.label')}
        placeholder={t('bankAccount.form.branchCode.placeholder')}
        required
        variant="outlined"
        value={branchCode}
        onChange={(ev) => setBranchCode(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !bankCode ||
              !branchCode ||
              props.loading
            }
            onSubmit={() =>
              props.onSubmit(
                account_holder_name,
                account_number,
                `${bankCode}-${branchCode}`,
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
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  return (
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
        value={account_holder_name || ''}
        onChange={(ev) => setAccountHolderName(ev.target.value)}
      />
      <TextField
        fullWidth
        className={classes.field}
        label={t('bankAccount.form.sortCode.label')}
        placeholder={t('bankAccount.form.sortCode.placeholder')}
        required
        variant="outlined"
        value={sortCode}
        onChange={(ev) => setSortCode(ev.target.value)}
      />
      <TextField
        fullWidth
        label={t('bankAccount.form.accountNumber.label')}
        required
        className={classes.field}
        placeholder={t('bankAccount.form.accountNumber.placeholder')}
        variant="outlined"
        value={account_number || ''}
        onChange={(ev) => setAccountNumber(ev.target.value)}
      />
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
          <Button
            color="primary"
            disabled={
              !account_holder_name ||
              !account_number ||
              !sortCode ||
              props.loading
            }
            onClick={() =>
              props.onSubmit(account_holder_name, account_number, sortCode)
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
