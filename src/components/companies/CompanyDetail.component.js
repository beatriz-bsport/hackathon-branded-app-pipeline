// @flow

import React, { useCallback } from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { Link } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import BankAccountFormDialog from '#libs/payment/components/BankAccountFormDialog.component';
import BankAccountSuccessDialog from '#libs/payment/components/BankAccountSuccess.dialog';

import AddressDetail from '../AddressDetail.component';

function getAddress(object, prefix) {
  const pre = prefix ? `${prefix}_` : '';
  return {
    address: object[`${pre}address`],
    city: object[`${pre}city`],
    postal_code: object[`${pre}postal_code`],
    state: object[`${pre}state`],
    country: object[`${pre}country`],
  };
}

type Props = {
  t: TFunction,
  classes: any,
  company: any,
  updateCompanyDetail: () => void,
  setAddExternalAccountOpen: (boolean) => void,
  addExternalAccountOpen: boolean,
  setExternalAccountSuccessOpen: (boolean) => void,
  externalAccountSuccessOpen: boolean,
  attachExternalAccount: (data: any, options: OptionCallback) => void,
  onSuccessDialogConfirmed: () => void,
};

export const CompanyDetail = (props: Props) => {
  const {
    company,
    t,
    classes,
    setAddExternalAccountOpen,
    setExternalAccountSuccessOpen,
    onSuccessDialogConfirmed,
  } = props;

  const bankAccountFormSuccess = useCallback(() => {
    setAddExternalAccountOpen(false);
    setExternalAccountSuccessOpen(true);
  }, [setAddExternalAccountOpen, setExternalAccountSuccessOpen]);

  return (
    <div className="company-detail">
      <Typography variant="h4" className={classes.pageTitle}>
        {`${company.business_name} (${company.name.toLowerCase()})`}
      </Typography>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography variant="h6" className={classes.title}>
                  {t('companies.address')}
                </Typography>
                <AddressDetail address={getAddress(company, '')} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={props.updateCompanyDetail}
                >
                  {t('common.edit')}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.title}>
              {t('companies.bank_details')}
            </Typography>
            <p>
              <strong>{t('companies.fields.iban')} : </strong>
              {`*************${company.external_account_last4}`}
              <br />
              <strong>{t('companies.fields.bank_account_holder')} : </strong>
              {company.bank_account_holder}
              <br />
            </p>
            <Alert severity="info" className={classes.title}>
              {`${t('settings:company.bankAccountInfo.content')} `}
              <Link to="/settings/platform-billing" className={classes.link}>
                {t('settings:company.bankAccountInfo.link')}
              </Link>
              .
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAddExternalAccountOpen(true)}
            >
              {t('common.edit')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <BankAccountFormDialog
        country={company.country}
        currency={company.currency}
        onSubmit={(data, options) => props.attachExternalAccount(data, options)}
        open={props.addExternalAccountOpen}
        onClose={() => setAddExternalAccountOpen(false)}
        company={company}
        onSuccess={bankAccountFormSuccess}
      />
      <BankAccountSuccessDialog
        open={props.externalAccountSuccessOpen}
        onCancel={() => setExternalAccountSuccessOpen(false)}
        onConfirm={onSuccessDialogConfirmed}
      />
    </div>
  );
};

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  pageTitle: {
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'underline',
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
    },
  },
});
export default compose(
  withStyles(styles),
  withTranslation(),
  withState('addExternalAccountOpen', 'setAddExternalAccountOpen', false),
  withState(
    'externalAccountSuccessOpen',
    'setExternalAccountSuccessOpen',
    false,
  ),
)(CompanyDetail);
