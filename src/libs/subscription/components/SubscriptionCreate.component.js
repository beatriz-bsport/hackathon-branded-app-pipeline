// @flow

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import DateInput from '../../../components/input/DateInput.component';
import Config from '../../../config';

import RecapSubscription from './RecapSubscription.component';

import type { SubscriptionData } from '../types';

type Props = {
  paymentPacks: Array<PaymentPack>,
  member: ?Member,
  withName: boolean,

  onSubmit: (data: SubscriptionData) => void,
  onCancel: () => void,

  t: TFunction,
  classes: Object,
};

type State = {
  payment_pack: ?number,
  nb_interval: ?number,
  recurrent_voucher: number,
  first_billing_timestamp: number,
};

export class SubscriptionCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payment_pack: null,
      nb_interval: null,
      recurrent_voucher: 0,
      name: '',
      first_billing_timestamp: parseInt((moment() + 0) / 1000, 10),
    };
  }

  onSubmit = () => {
    const { member, paymentPacks } = this.props;
    const {
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
      trial_nb: 0, // DEPRECATED
      recurrent_voucher: parseFloat(recurrent_voucher),
      recurrent_price: parseFloat(paymentPackSelected.price),
      interval: 'month',
      first_billing_timestamp,
    };
    this.props.onSubmit(
      this.props.withName ? { ...data, name: this.state.name } : data,
    );
  };

  formIsFilled = () =>
    this.state.payment_pack &&
    this.state.nb_interval &&
    this.props.member &&
    (this.props.withName ? !!this.state.name : true);

  updatePaymentPack = (id: number) => this.setState({ payment_pack: id });

  updateNbInterval = (event: SyntheticInputEvent<*>) =>
    this.setState({ nb_interval: event.target.value });

  updateFirstBillingTimestamp = (event: SyntheticInputEvent<*>) =>
    this.setState({
      first_billing_timestamp: parseInt((event + 0) / 1000, 10),
    });

  updateRecurrentVoucher = (event: SyntheticInputEvent<*>) =>
    this.setState({
      recurrent_voucher: event.target.value || 0,
    });

  updateName = (event: SyntheticInputEvent<*>) =>
    this.setState({
      name: event.target.value,
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
        <div className={classes.container}>
          {this.props.withName ? (
            <TextField
              label={this.props.t('contract.form.name.label')}
              placeholder={this.props.t('contract.form.name.placeholder')}
              value={this.state.name}
              onChange={this.updateName}
              className={this.props.classes.field}
              fullWidth
            />
          ) : null}
          <PaymentPackSelector
            paymentPacks={paymentPacks}
            value={this.state.payment_pack}
            onChange={this.updatePaymentPack}
            helperText={t('parameters.paymentPack')}
            selectorClass={classes.selector}
          />
          <div className={classes.field}>
            <NumericInput
              value={this.state.nb_interval}
              label={t('parameters.nbMonths')}
              onChange={this.updateNbInterval}
            />
          </div>
          <div className={classes.field}>
            <DateInput
              minDate={moment().format('YYYY/MM/DD')}
              value={this.state.first_billing_timestamp * 1000}
              label={t('parameters.firstBilling')}
              onChange={this.updateFirstBillingTimestamp}
            />
          </div>
          <div className={classes.field}>
            {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' ? null : (
              <FormControlLabel
                control={<Checkbox value="autoRenew" />}
                label={this.props.t('parameters.autoRenew')}
              />
            )}
          </div>
          <div className={classes.field}>
            <div className={classes.voucherFields}>
              <Typography variant="subtitle1" className={classes.voucherTitle}>
                {t('parameters.voucher')}
              </Typography>
              <div className={classes.inlineField}>
                <PriceInput
                  value={this.state.recurrent_voucher}
                  label={t('parameters.recurrent_voucher')}
                  onChange={this.updateRecurrentVoucher}
                />
              </div>
            </div>
          </div>
          <div className={classes.recap}>
            <RecapSubscription
              periodName="month"
              member={member}
              recurrentVoucher={this.state.recurrent_voucher}
              nbPeriod={this.state.nb_interval}
              price={paymentPackSelected && paymentPackSelected.price}
              subscriptionContentName={
                paymentPackSelected && paymentPackSelected.name
              }
            />
          </div>
          <div>
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
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  recap: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  voucherFields: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    marginLeft: 0,
    border: '1px solid #DDDDDD',
    borderRadius: 6,
  },
  field: {
    marginBottom: theme.spacing(1),
  },
  inlineField: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  selector: {
    width: 260,
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionCreate);
