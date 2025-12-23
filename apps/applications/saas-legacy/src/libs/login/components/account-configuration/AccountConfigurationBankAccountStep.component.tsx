import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import clsx from 'clsx';
import BankAccountForm from '#src/libs/payment/components/BankAccountForm.component';
import { CompanySetup } from '#src/libs/company/types';
import { OptionCallback } from '../../../../state/types';
import { buildSteps } from './utils';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';
import SuccessBox from './SuccessBox.component';
import InfoBox from './InfoBox.component';

type OwnProps = {
  company: CompanySetup;

  submitBankAccount: (
    token: string,
    options?: OptionCallback<CompanySetup>,
  ) => void;
  goNext: () => void;
  goPrevious: () => void;
  labelGoNext: string;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
  success: boolean;
};
type Props = OwnProps;
export const AccountConfigurationBankAccountStep: React.FC<Props> = ({
  company,
  labelGoNext,
  has_no_need_for_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
  success,
  goPrevious,
  goNext,
  submitBankAccount,
}) => {
  const { t } = useTranslation(['login', 'common', 'payment']);

  const classes = useStyles();

  const steps = React.useMemo(() => {
    return buildSteps({
      has_no_need_for_stripe_configuration,
      has_visited_stripe_configuration: true,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: true,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: false,
      has_visited_invoice_numbering_step: false,
      no_last_step: false,
      has_visited_last_step: false,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);

  if (!company) {
    return null;
  }

  const externalAccountLast4Digit = company.external_account_last4;

  return (
    <>
      <div className={classes.content}>
        <AccountConfigurationStepper
          className={classes.stepper}
          steps={steps}
        />
        <div
          className={clsx(
            {
              [classes.successBankAccount]: success,
            },
            classes.bankAccount,
          )}
        >
          {!externalAccountLast4Digit || !company.bank_account_holder ? (
            <>
              <Typography className={classes.bankAccountTitle} variant="h4">
                {t('payment:bankAccount.form.title')}
              </Typography>
              <Typography className={classes.bankAccountContent}>
                {t('payment:bankAccount.form.content')}
              </Typography>
              <BankAccountForm
                company={company}
                currency={company.currency}
                labelOnClose={t('common:previous')}
                onClose={goPrevious}
                onSubmit={submitBankAccount}
              />
            </>
          ) : (
            <div className={classes.paper}>
              <Typography className={classes.title} variant="h6">
                {t('login:accountConfiguration.bankAccount.bank_details')}
              </Typography>
              <p>
                <strong>
                  {t('login:accountConfiguration.bankAccount.fields.iban')} :{' '}
                </strong>
                {`*************${externalAccountLast4Digit}`}
                <br />
                <strong>
                  {`${t(
                    'accountConfiguration.bankAccount.fields.bank_account_holder',
                  )} `}
                  :{' '}
                </strong>
                {company.bank_account_holder}
                <br />
              </p>
            </div>
          )}
        </div>
        {success && (
          <SuccessBox
            content={t('login:accountConfiguration.bankAccountSuccess')}
          />
        )}
        <InfoBox />
        {success && (
          <div className={classes.action}>
            <Button onClick={goPrevious}>{t('common:previous')}</Button>
            <Button color="primary" onClick={goNext} variant="contained">
              {labelGoNext || t('common:next')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  successBankAccount: {
    '& #bankAccountFormAction': {
      display: 'none',
    },
    '& bankAccountFormContainer': {
      padding: '0px',
    },
  },
  bankAccount: {
    '&>#bankAccountFormContainer': {
      padding: '8px 0px',
    },
    '& #bankAccountTitle': { display: 'none' },
    '& #bankAccountContent': { display: 'none' },
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(10),
      marginLeft: '4px',
      marginRight: '4px',
    },
  },
  stepper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingBottom: theme.spacing(3),
      marginBottom: 'unset',
    },
  },
  bankAccountTitle: {
    marginBottom: theme.spacing(2),
  },
  bankAccountContent: {
    marginBottom: theme.spacing(1),
  },
}));

export default AccountConfigurationBankAccountStep;
