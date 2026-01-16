// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status.js';
import { DateTime } from 'luxon';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import type { StripeReader } from '#src/libs/terminal/types';
import { getStripeRegion, getCompanyCountry } from '../../theme/selectors';
import SubscriptionPayment from './SubscriptionPayment.component';

import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from '../types';

import type { EstablishmentBillingGroup } from '../../establishment/types';

type Props = {
  onlinePaymentEnabled: boolean,
  subscriptionData?: SubscriptionData,
  processing: boolean,
  onSubmit: (token: string) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
  member: Member,
  refreshSavedPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  establishmentBillingGroups: Array<EstablishmentBillingGroup>,
  enableMultiLocalization: boolean,
  companyTheme: CompanyTheme,
  stripeReaders: StripeReader[],
  companyId?: number,
  cardBillingDetailsMandatory: boolean,
  defaultBillingGroup?: EstablishmentBillingGroup,
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
        date: DateTime.fromMillis(
          subscriptionData.first_billing_timestamp * 1000,
        ).plus({ months: s.length }),
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

    const firstBillingDateInThePast =
      DateTime.fromMillis(subscriptionData.first_billing_timestamp * 1000) <=
      DateTime.now().startOf('day');

    const scheduledInvoices =
      getScheduledInvoicesFromSubscriptionData(subscriptionData);

    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    return (
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography className={classes.title} variant="h5">
            {t('subscription:schedule.provisionalTitle')}
          </Typography>
          <Paper>
            <SubscriptionSchedule scheduledInvoices={scheduledInvoices} />
          </Paper>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography className={classes.title} variant="h5">
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
                forceEstablishmentBillingGroupselection
                withEstablishment
                cardBillingDetailsMandatory={
                  this.props.cardBillingDetailsMandatory
                }
                companyId={this.props.companyId}
                date={DateTime.fromMillis(
                  subscriptionData.first_billing_timestamp * 1000,
                )}
                defaultBillingGroup={this.props.defaultBillingGroup}
                enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                  {
                    currency: this.props.companyTheme.currency,
                    companyCountry,
                    withCredit: true,
                    stripeRegion,
                    withTerminal: true,
                  },
                )}
                enableMultiLocalization={this.props.enableMultiLocalization}
                establishmentBillingGroups={
                  this.props.establishmentBillingGroups
                }
                member={this.props.member}
                onCancel={this.props.onCancel}
                onlinePaymentEnabled={this.props.onlinePaymentEnabled}
                onSubmit={this.props.onSubmit}
                pastInvoices={
                  DateTime.fromMillis(
                    subscriptionData.first_billing_timestamp * 1000,
                  ) <= DateTime.now().startOf('day')
                }
                processing={this.props.processing}
                refreshSavedPaymentMethodList={
                  this.props.refreshSavedPaymentMethodList
                }
                requestSetupIntentSecret={this.props.requestSetupIntentSecret}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
                stripeReaders={this.props.stripeReaders}
                subscriptionData={this.props.subscriptionData}
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
