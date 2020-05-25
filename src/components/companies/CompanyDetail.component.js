// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
        <Typography variant="h4" className={classes.pageTitle}>
          {`${company.business_name} (${company.name.toLowerCase()})`}
        </Typography>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Typography variant="h6" className={classes.title}>
                    {t('companies.general')}
                  </Typography>
                  <strong>
                    {t('common.firstname')}
                    {' : '}
                  </strong>
                  {company.representative_first_name}
                  <br />
                  <strong>
                    {t('common.lastname')}
                    {' : '}
                  </strong>
                  {company.representative_last_name}
                  <br />
                  <strong>
                    {t('common.email')}
                    {' : '}
                  </strong>
                  {company.email}
                  <br />
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Typography variant="h6" className={classes.title}>
                    {t('companies.address')}
                  </Typography>
                  <AddressDetail address={getAddress(company, '')} />
                  <Typography variant="h6" className={classes.title}>
                    {t('companies.owner_address')}
                  </Typography>
                  <AddressDetail address={getAddress(company, 'owner')} />
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
                {company.iban}
                <br />
                <strong>{t('companies.fields.bank_account_holder')} : </strong>
                {company.bank_account_holder}
                <br />
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

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

export default withStyles(styles)(withTranslation()(CompanyDetail));
