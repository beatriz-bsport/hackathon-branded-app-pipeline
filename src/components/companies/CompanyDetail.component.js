// @flow

import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import BankAccountFormDialog from '../../libs/payment/components/BankAccountFormDialog.component';

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
  attachExternalAccount: (data: any, options: OptionCallback) => void,
};

export const CompanyDetail = (props: Props) => {
  const { company, t, classes } = props;
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => props.setAddExternalAccountOpen(true)}
            >
              {t('common.edit')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <BankAccountFormDialog
        country={company.country}
        currency={company.currency}
        onSubmit={props.attachExternalAccount}
        open={props.addExternalAccountOpen}
        onClose={() => props.setAddExternalAccountOpen(false)}
        company={company}
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
});

export default compose(
  withStyles(styles),
  withTranslation(),
  withState('addExternalAccountOpen', 'setAddExternalAccountOpen', false),
)(CompanyDetail);
