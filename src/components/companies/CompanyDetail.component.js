// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

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
  classes: *,
  company: *,
};
type State = {};

export class CompanyDetail extends Component<Props, State> {
  state = {};

  render() {
    const { company, t, classes } = this.props;
    return (
      <div className="company-detail">
        <Paper className={classes.paper}>
          <Typography variant="h1">
            {company.business_name} ({company.name})
          </Typography>
          <p>
            {company.representative_first_name}{' '}
            {company.representative_last_name}
          </p>
          <p>{company.email}</p>

          <Typography variant="title" className={classes.title}>
            {t('companies.address')}
          </Typography>
          <AddressDetail address={getAddress(company, '')} />

          <Typography variant="title" className={classes.title}>
            {t('companies.owner_address')}
          </Typography>
          <AddressDetail address={getAddress(company, 'owner')} />
          <Typography variant="title" className={classes.title}>
            {t('companies.bank_details')}
          </Typography>
          <p>
            <strong>{t('companies.fields.iban')}:</strong>
            {company.iban}
            <br />
            <strong>{t('companies.fields.bank_account_holder')}:</strong>
            {company.bank_account_holder}
            <br />
          </p>
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 2,
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(CompanyDetail));
