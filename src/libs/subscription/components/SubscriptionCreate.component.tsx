import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment-timezone';

import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';

import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import DateInput from '../../../components/input/DateInput.component';
import ModalConfirm from '../../../components/ModalConfirm.component';

import RecapSubscription from './RecapSubscription.component';
import { paymentPackTagsAndMemberTagsCompatibilty } from '../../payment-packs/utils';
import type { SubscriptionData } from '../types';
import { PrivatePass } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import { Member } from '../../member/types';
import { MaterialStyleType } from '../../../utils/types';
import { PaymentCombo } from '../../payment-combo/types';

type OwnProps = {
  paymentPacks: Array<PaymentPack>;
  privatePassList: PrivatePass[];
  paymentComboList: PaymentCombo[];
  member: Member;
  withName: boolean;
  onSubmit: (data: SubscriptionData) => void;
  onCancel: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  nb_interval?: number;
  recurrent_voucher: number;
  first_billing_timestamp: number;
  name: string;
  warnManagerOnInvoice: boolean;
};

export class SubscriptionCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      payment_pack: null,
      private_pass: null,
      payment_combo: null,
      nb_interval: null,
      recurrent_voucher: 0,
      name: '',
      first_billing_timestamp: parseInt((moment() + 0) / 1000, 10),
      warnManagerOnInvoice: false,
    };
  }

  onSubmit = () => {
    const { member, paymentPacks, privatePassList, paymentComboList } =
      this.props;

    const {
      recurrent_voucher,
      nb_interval,
      payment_pack,
      private_pass,
      payment_combo,
      first_billing_timestamp,
    } = this.state;

    const paymentPackSelected =
      this.state.payment_pack &&
      paymentPacks.find((pp) => pp.id === this.state.payment_pack);

    const privatePassSelected =
      this.state.private_pass &&
      privatePassList.find((pp) => pp.id === this.state.private_pass);

    const paymentComboSelected =
      this.state.payment_combo &&
      paymentComboList.find((pc) => pc.id === this.state.payment_combo);

    let price = 0;
    let name = '';

    if (paymentPackSelected) {
      name = paymentPackSelected.name;
      price = paymentPackSelected.price;
    }
    if (privatePassSelected) {
      name = privatePassSelected.name;
      price = privatePassSelected.price;
    }

    if (paymentComboSelected) {
      name = paymentComboSelected.name;
      price = paymentComboSelected.price;
    }

    const data = {
      name,
      member: member.id,
      nb_interval: parseInt(nb_interval),
      payment_pack,
      private_pass,
      payment_combo,
      trial_nb: 0, // DEPRECATED
      recurrent_voucher,
      recurrent_price: price,
      interval: 'month',
      first_billing_timestamp,
    };
    this.props.onSubmit(
      this.props.withName ? { ...data, name: this.state.name } : data,
    );
  };

  formIsFilled = () =>
    (this.state.payment_pack ||
      this.state.private_pass ||
      this.state.payment_combo) &&
    this.state.nb_interval &&
    this.props.member &&
    (this.props.withName ? !!this.state.name : true);

  updatePaymentPack = (id: number) =>
    this.setState({
      payment_pack: id,
      private_pass: null,
      payment_combo: null,
      warnManagerOnInvoice: paymentPackTagsAndMemberTagsCompatibilty(
        this.props.paymentPacks.find((pack) => pack.id === id),
        this.props?.member?.tags,
      ),
    });

  updatePrivatePass = (id: number) =>
    this.setState({
      payment_pack: null,
      private_pass: id,
      payment_combo: null,
    });

  updatePaymentCombo = (id: number) => {
    this.setState({
      payment_pack: null,
      private_pass: null,
      payment_combo: id,
    });
  };

  handleResetSelection = () =>
    this.setState({
      payment_pack: null,
      private_pass: null,
      payment_combo: null,
      warnManagerOnInvoice: false,
    });

  updateNbInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nb_interval = parseInt(event.target.value);
    this.setState({ nb_interval });
  };

  updateFirstBillingTimestamp = (event: any) =>
    this.setState({
      first_billing_timestamp: parseInt((event + 0) / 1000, 10),
    });

  updateRecurrentVoucher = (event: any) =>
    this.setState({
      recurrent_voucher: event.target.value || 0,
    });

  updateName = (event: any) =>
    this.setState({
      name: event.target.value,
    });

  render() {
    const {
      t,
      member,
      paymentPacks,
      privatePassList,
      paymentComboList,
      classes,
      onCancel,
    } = this.props;

    if (!member) {
      return <CircularProgress />;
    }
    const paymentPackSelected =
      this.state.payment_pack &&
      paymentPacks.find((pp) => pp.id === this.state.payment_pack);

    const privatePassSelected =
      this.state.private_pass &&
      privatePassList.find((pp) => pp.id === this.state.private_pass);

    const paymentComboSelected =
      this.state.payment_combo &&
      paymentComboList.find((pc) => pc.id === this.state.payment_combo);

    let recapPrice = '';
    let recapName = '';

    if (paymentPackSelected) {
      recapName = paymentPackSelected.name;
      recapPrice = paymentPackSelected.price;
    }
    if (privatePassSelected) {
      recapName = privatePassSelected.name;
      recapPrice = privatePassSelected.price;
    }

    if (paymentComboSelected) {
      recapName = paymentComboSelected.name;
      recapPrice = paymentComboSelected.price;
    }
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
            nullCurrentValue={
              typeof this.state.private_pass === 'number' ||
              typeof this.state.payment_combo === 'number' ||
              this.state.warnManagerOnInvoice
            }
          />

          <PrivatePassSelector
            privatePassList={privatePassList}
            value={this.state.private_pass}
            helperText={t('parameters.privatePass')}
            onChange={this.updatePrivatePass}
            selectorClass={classes.selector}
            nullCurrentValue={
              typeof this.state.payment_pack === 'number' ||
              typeof this.state.payment_combo === 'number'
            }
          />

          <PaymentComboSelector
            paymentComboList={paymentComboList}
            value={this.state.payment_combo}
            helperText={t('parameters.paymentCombo')}
            onChange={this.updatePaymentCombo}
            selectorClass={classes.selector}
            nullCurrentValue={
              typeof this.state.payment_pack === 'number' ||
              typeof this.state.private_pass === 'number'
            }
          />

          <div className={classes.field}>
            <NumericInput
              value={this.state.nb_interval}
              label={t('parameters.nbMonths')}
              onChange={this.updateNbInterval}
              fullWidth
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
            <div className={classes.voucherFields}>
              <Typography variant="subtitle1">
                {t('parameters.voucher')}
              </Typography>
              <div className={classes.inlineField}>
                <PriceInput
                  value={this.state.recurrent_voucher}
                  label={t('parameters.recurrent_voucher')}
                  onChange={this.updateRecurrentVoucher}
                  fullWidth
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
              price={recapPrice}
              subscriptionContentName={recapName}
              dateStart={this.state.first_billing_timestamp * 1000}
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
        <ModalConfirm
          open={this.state.warnManagerOnInvoice}
          options={{
            title: 'invoice:invoicePaymentPackTagWarningDialog.title',
            Content: () => (
              <p>{t('invoice:invoicePaymentPackTagWarningDialog.content')}</p>
            ),
          }}
          handleCancel={this.handleResetSelection}
          handleConfirm={() =>
            this.setState({
              warnManagerOnInvoice: false,
            })
          }
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 480,
  },
  recap: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  voucherFields: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    marginLeft: 0,
    border: '1px solid #DDDDDD',
    borderRadius: 6,
    width: '100%',
  },
  field: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  inlineField: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    width: '100%',
  },
  selector: {
    width: '100%',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionCreate);
