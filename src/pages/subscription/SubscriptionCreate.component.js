// @flow

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment';
import type { TFunction } from 'react-i18next';

import PaymentPackInput from '../../components/input/PaymentPackInput.component';
import NumericInput from '../../components/input/NumericInput.component';
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
  paymentPack: ?number,
  nb_interval: ?number,
  billing_anchor: ?string,
};

export class SubscriptionCreate extends Component<Props, State> {
  state = {
    paymentPack: null,
    nb_interval: null,
    billing_anchor: null,
  };

  onSubmit = () => {
    const { member } = this.props;
    const { billing_anchor, nb_interval, paymentPack } = this.state;

    const paymentPackSelected =
      this.state.paymentPack &&
      this.props.paymentPacks.find((pp) => pp.id === this.state.paymentPack);

    const data = {
      name: paymentPackSelected.name,
      member: parseInt(this.props.member.id, 10),
      nb_interval: parseInt(nb_interval, 10),
      paymentPack: parseInt(paymentPack, 10),
      billing_anchor: moment(billing_anchor) + 0,
      recurrent_price: parseFloat(paymentPackSelected.price),
      interval: 'month',
    };
    this.props.onSubmit(data);
  };

  formIsFilled = () =>
    this.state.paymentPack &&
    this.state.nb_interval &&
    this.state.billing_anchor &&
    this.props.member;

  updatePaymentPack = (id: number) => this.setState({ paymentPack: id });

  updateNbInterval = (event: *) =>
    this.setState({ nb_interval: event.target.value });

  updateBillingAnchor = (billing_anchor: string) =>
    this.setState({ billing_anchor });

  render() {
    const { t, member, paymentPacks, classes, onCancel } = this.props;
    if (!member) {
      return <CircularProgress />;
    }
    const paymentPackSelected =
      this.state.paymentPack &&
      paymentPacks.find((pp) => pp.id === this.state.paymentPack);
    return (
      <div>
        <Typography variant="h4">{t('form.title')}</Typography>
        <Grid container direction="column" alignItems="flex-start">
          <Grid item>
            <PaymentPackInput
              paymentPacks={paymentPacks}
              value={this.state.paymentPack}
              onChange={this.updatePaymentPack}
              label={t('parameters.paymentPack')}
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
              value={this.state.billing_anchor}
              label={t('parameters.dateStart')}
              onChange={this.updateBillingAnchor}
              minDate={moment().add(1, 'day')}
            />
          </Grid>
          <Grid item className={classes.recap}>
            <RecapSubscription
              periodName="month"
              member={member}
              dateStart={this.state.billing_anchor}
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
  field: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
)(SubscriptionCreate);
