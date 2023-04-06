// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import moment from 'moment-timezone';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';
import { getStripeRegion, getCompanyCountry } from '../../theme/selectors';
import SubscriptionPayment from './SubscriptionPayment.component';

import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from '../types';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#libs/payment/utils';

import type { Establishment } from '../../establishment/types';
import type { StripeReader } from '#libs/terminal/types';

type Props = {
  onlinePaymentEnabled: boolean,
  subscriptionData: ?SubscriptionData,
  processing: boolean,
  onSubmit: (token: string) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
  member: Member,
  refreshSavedPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  establishments: Array<Establishment>,
  enableMultiLocalization: boolean,
  companyTheme: CompanyTheme,
  stripeReaders: StripeReader[],
  companyId?: number,
};

type State = {
  loading: boolean,
};

const getScheduledInvoicesFromSubscriptionData = (
  subscriptionData: SubscriptionData,
) =>
  Array(...Array(subscriptionData.nb_interval)).reduce(
    (s) => [
      ...s,
      {
        status: PLANNED_INVOICE_PENDING.id,
        date: moment(subscriptionData.first_billing_timestamp * 1000)
          .clone()
          .add(s.length, 'month'),
        price:
          subscriptionData.recurrent_price - subscriptionData.recurrent_voucher,
      },
    ],
    [],
  );

export class SubscriptionScheduleChecker extends Component<Props, State> {
  componentDidMount() {
    this.props.refreshSavedPaymentMethodList();
  }

  render() {
    const { subscriptionData, classes, t } = this.props;
    if (!subscriptionData) {
      return null;
    }

    const firstBillingDateInThePast = moment(
      subscriptionData.first_billing_timestamp * 1000,
    ).isBefore(moment().startOf('day'));

    const scheduledInvoices =
      getScheduledInvoicesFromSubscriptionData(subscriptionData);

    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" className={classes.title}>
            {t('subscription:schedule.provisionalTitle')}
          </Typography>
          <Paper>
            <SubscriptionSchedule scheduledInvoices={scheduledInvoices} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" className={classes.title}>
            {t('subscription:schedule.paymentMethodTitle')}
          </Typography>
          <Paper className={classes.paymentContainer}>
            {firstBillingDateInThePast && (
              <Typography variant="h6">
                {this.props.t(
                  'subscription:contract.pastDate.futureInvoicesPayment',
                )}
              </Typography>
            )}
            {!!companyCountry && !!stripeRegion && (
              <SubscriptionPayment
                onSubmit={this.props.onSubmit}
                onCancel={this.props.onCancel}
                processing={this.props.processing}
                onlinePaymentEnabled={this.props.onlinePaymentEnabled}
                member={this.props.member}
                enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                  {
                    currency: this.props.companyTheme.currency,
                    companyCountry,
                    withCredit: true,
                    stripeRegion,
                  },
                )}
                requestSetupIntentSecret={this.props.requestSetupIntentSecret}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                refreshSavedPaymentMethodList={
                  this.props.refreshSavedPaymentMethodList
                }
                enableMultiLocalization={this.props.enableMultiLocalization}
                forceEstablishmentSelection
                withEstablishment
                establishments={this.props.establishments}
                stripeReaders={this.props.stripeReaders}
                subscriptionData={this.props.subscriptionData}
                pastInvoices={moment(
                  subscriptionData.first_billing_timestamp * 1000,
                ).isBefore(moment().startOf('day'))}
                date={moment(subscriptionData.first_billing_timestamp * 1000)}
                companyId={this.props.companyId}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  paymentContainer: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(2),
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
  },
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  nameAndEmailContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  mandate: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['stripe', 'subscription']),
  withStyles(styles),
)(SubscriptionScheduleChecker);
