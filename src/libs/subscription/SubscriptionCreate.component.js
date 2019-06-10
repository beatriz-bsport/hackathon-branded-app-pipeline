// @flow

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import PaymentPackSelector from '../payment-packs/PaymentPackSelector.component';
import NumericInput from '../../components/input/NumericInput.component';
import PriceInput from '../../components/input/PriceInput.component';
import DateInput from '../../components/input/DateInput.component';

import RecapSubscription from './RecapSubscription.component';

import type { SubscriptionData } from './types';

type Props = {
  paymentPacks: Array<PaymentPack>,
  member: ?Member,

  onSubmit: (data: SubscriptionData) => void,
  onCancel: () => void,

  t: TFunction,
  classes: Object,
};

type State = {
  payment_pack: ?number,
  nb_interval: ?number,
  recurrent_voucher: number,
  trial_nb: number,
  first_billing_timestamp: number,
};

export class SubscriptionCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payment_pack: null,
      nb_interval: null,
      trial_nb: 0,
      recurrent_voucher: 0,
      first_billing_timestamp: parseInt((moment() + 0) / 1000, 10),
    };
  }

  onSubmit = () => {
    const { member, paymentPacks } = this.props;
    const {
      trial_nb,
      recurrent_voucher,
      nb_interval,
      payment_pack,
      first_billing_timestamp,
    } = this.state;

    const paymentPackSelected =
      payment_pack && paymentPacks.find((pp) => pp.id === payment_pack);

    const data = {
      name: paymentPackSelected.name,
      member: parseInt(member.id, 10),
      nb_interval: parseInt(nb_interval, 10),
      payment_pack: parseInt(payment_pack, 10),
      trial_nb,
      recurrent_voucher: parseFloat(recurrent_voucher),
      recurrent_price: parseFloat(paymentPackSelected.price),
      interval: 'month',
      first_billing_timestamp,
    };
    this.props.onSubmit(data);
  };

  formIsFilled = () =>
    this.state.payment_pack && this.state.nb_interval && this.props.member;

  updatePaymentPack = (id: number) => this.setState({ payment_pack: id });

  updateNbInterval = (event: SyntheticInputEvent<*>) =>
    this.setState({ nb_interval: event.target.value });

  updateFirstBillingTimestamp = (event: SyntheticInputEvent<*>) =>
    this.setState({
      first_billing_timestamp: parseInt((event + 0) / 1000, 10),
    });

  updateTrialPeriod = (event: SyntheticInputEvent<*>) =>
    this.setState({ trial_nb: parseInt(event.target.value, 10) || 0 });

  updateRecurrentVoucher = (event: SyntheticInputEvent<*>) =>
    this.setState({
      recurrent_voucher: event.target.value || 0,
    });

  render() {
    const { t, member, paymentPacks, classes, onCancel } = this.props;
    if (!member) {
      return <CircularProgress />;
    }
    const paymentPackSelected =
      this.state.payment_pack &&
      paymentPacks.find((pp) => pp.id === this.state.payment_pack);
    return (
      <div>
        <Grid container direction="column" alignItems="flex-start">
          <Grid item>
            <PaymentPackSelector
              paymentPacks={paymentPacks}
              value={this.state.payment_pack}
              onChange={this.updatePaymentPack}
              helperText={t('parameters.paymentPack')}
              selectorClass={classes.selector}
            />
          </Grid>
          <Grid item className={classes.field}>
            <NumericInput
              value={this.state.nb_interval}
              label={t('parameters.nbMonths')}
              onChange={this.updateNbInterval}
            />
          </Grid>
          <Grid item className={classes.field}>
            <DateInput
              minDate={moment().format('YYYY/MM/DD')}
              value={this.state.first_billing_timestamp * 1000}
              label={t('parameters.firstBilling')}
              onChange={this.updateFirstBillingTimestamp}
            />
          </Grid>
          <Grid item className={classes.field}>
            <div className={classes.voucherFields}>
              <Typography variant="subtitle1" className={classes.voucherTitle}>
                {t('parameters.voucher')}
              </Typography>
              <div className={classes.inlineField}>
                <NumericInput
                  value={this.state.trial_nb}
                  label={t('parameters.trial_nb')}
                  onChange={this.updateTrialPeriod}
                />
              </div>
              <div className={classes.inlineField}>
                <PriceInput
                  value={this.state.recurrent_voucher}
                  label={t('parameters.recurrent_voucher')}
                  onChange={this.updateRecurrentVoucher}
                />
              </div>
            </div>
          </Grid>
          <Grid item className={classes.recap}>
            <RecapSubscription
              periodName="month"
              member={member}
              trialNb={this.state.trial_nb}
              recurrentVoucher={this.state.recurrent_voucher}
              nbPeriod={this.state.nb_interval}
              price={paymentPackSelected && paymentPackSelected.price}
              subscriptionContentName={
                paymentPackSelected && paymentPackSelected.name
              }
            />
          </Grid>
          <Grid item>
            <Button color="secondary" onClick={onCancel}>
              {t('form.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={!this.formIsFilled()}
              onClick={this.onSubmit}
            >
              {t('form.check')}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  recap: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 2,
    borderRadius: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  voucherFields: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    marginLeft: 0,
    border: '1px solid #DDDDDD',
    borderRadius: 6,
  },
  field: {
    marginBottom: theme.spacing.unit,
  },
  inlineField: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  selector: {
    width: 260,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
)(SubscriptionCreate);
