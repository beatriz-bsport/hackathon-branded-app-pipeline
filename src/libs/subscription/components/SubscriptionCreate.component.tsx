import React, { ChangeEvent, Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import type { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { DateTime } from 'luxon';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
// @ts-expect-error
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
// @ts-expect-error
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';

import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import DateInput from '../../../components/input/DateInput.component';
import ModalConfirm from '../../../components/ModalConfirm.component';

// @ts-expect-error
import RecapSubscription from './RecapSubscription.component';
import { paymentPackTagsAndMemberTagsCompatibilty } from '../../payment-packs/utils';
import type { SubscriptionData } from '../types';
import { PrivatePass } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import { Member } from '../../member/types';
import { MaterialStyleType } from '../../../utils/types';
import { PaymentCombo } from '../../payment-combo/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { PLANNED_INVOICE_TIME_CONFIGURATION } from '../constants';

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
  firstBillingDate: DateTime;
  name: string;
  warnManagerOnInvoice: boolean;
  alertPickedDateInThePast: boolean;
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
      first_billing_timestamp: DateTime.now()
        .set(PLANNED_INVOICE_TIME_CONFIGURATION)
        .toUnixInteger(),
      firstBillingDate: DateTime.now().set(PLANNED_INVOICE_TIME_CONFIGURATION),
      warnManagerOnInvoice: false,
      alertPickedDateInThePast: false,
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
      nb_interval,
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
      // @ts-expect-error
      this.props.withName ? { ...data, name: this.state.name } : data,
    );
  };

  formIsFilled = () =>
    (!!this.state.payment_pack ||
      !!this.state.private_pass ||
      !!this.state.payment_combo) &&
    !!this.state.nb_interval &&
    !!this.props.member &&
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

  updateFirstBillingTimestamp = (timeStamp: DateTime) => {
    this.setState({
      first_billing_timestamp: timeStamp
        .set(PLANNED_INVOICE_TIME_CONFIGURATION)
        .toUnixInteger(),
      firstBillingDate: timeStamp.set(PLANNED_INVOICE_TIME_CONFIGURATION),
      alertPickedDateInThePast:
        timeStamp.set(PLANNED_INVOICE_TIME_CONFIGURATION) <
        DateTime.now().set(PLANNED_INVOICE_TIME_CONFIGURATION).startOf('day'),
    });
  };

  handleBlurRecurrentVoucher = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || '0';
    parseFloat(value) <= 0 &&
      this.setState({
        recurrent_voucher: 0,
      });
  };

  updateRecurrentVoucher = (event: any) =>
    this.setState({
      recurrent_voucher: event.target.value,
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
      recapPrice = String(paymentPackSelected.price);
    }
    if (privatePassSelected) {
      recapName = privatePassSelected.name;
      recapPrice = String(privatePassSelected.price);
    }

    if (paymentComboSelected) {
      recapName = paymentComboSelected.name;
      recapPrice = String(paymentComboSelected.price);
    }
    return (
      <div>
        <div className={classes.container}>
          {this.props.withName ? (
            <TextField
              fullWidth
              className={this.props.classes.field}
              label={this.props.t('contract.form.name.label')}
              onChange={this.updateName}
              placeholder={this.props.t('contract.form.name.placeholder')}
              value={this.state.name}
            />
          ) : null}
          <PaymentPackSelector
            helperText={t('parameters.paymentPack')}
            nullCurrentValue={
              typeof this.state.private_pass === 'number' ||
              typeof this.state.payment_combo === 'number' ||
              this.state.warnManagerOnInvoice
            }
            onChange={this.updatePaymentPack}
            paymentPacks={paymentPacks}
            selectorClass={classes.selector}
            value={this.state.payment_pack}
          />

          <PrivatePassSelector
            helperText={t('parameters.privatePass')}
            nullCurrentValue={
              typeof this.state.payment_pack === 'number' ||
              typeof this.state.payment_combo === 'number'
            }
            onChange={this.updatePrivatePass}
            privatePassList={privatePassList}
            selectorClass={classes.selector}
            value={this.state.private_pass}
          />

          <PaymentComboSelector
            helperText={t('parameters.paymentCombo')}
            nullCurrentValue={
              typeof this.state.payment_pack === 'number' ||
              typeof this.state.private_pass === 'number'
            }
            onChange={this.updatePaymentCombo}
            paymentComboList={paymentComboList}
            selectorClass={classes.selector}
            value={this.state.payment_combo}
          />

          <div className={classes.field}>
            <NumericInput
              fullWidth
              label={t('parameters.nbMonths')}
              onChange={this.updateNbInterval}
              value={this.state.nb_interval}
            />
          </div>
          <DateInput
            label={t('parameters.firstBilling')}
            minDate={DateTime.now().minus({ year: 1 })}
            onChange={this.updateFirstBillingTimestamp}
            value={DateTime.fromSeconds(this.state.first_billing_timestamp)}
          />
          <GenericResponsiveDialog
            maxWidth="sm"
            open={this.state.alertPickedDateInThePast}
          >
            <DialogTitle>{this.props.t('contract.pastDate.title')}</DialogTitle>
            <DialogContent>
              {this.state.firstBillingDate.hasSame(DateTime.now(), 'month') ? (
                this.props.t('contract.pastDate.alertSameMonth', {
                  lostDays: DateTime.now().diff(this.state.firstBillingDate)
                    .days,
                })
              ) : (
                <div>
                  {this.props.t('contract.pastDate.alertDifferentMonth')}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  this.setState({
                    first_billing_timestamp: DateTime.now().toUnixInteger(),
                    firstBillingDate: DateTime.now(),
                    alertPickedDateInThePast: false,
                  });
                }}
              >
                {this.props.t('contract.pastDate.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ alertPickedDateInThePast: false });
                }}
                variant="contained"
              >
                {this.props.t('contract.pastDate.validate')}
              </Button>
            </DialogActions>
          </GenericResponsiveDialog>
          <div className={classes.field}>
            <div className={classes.voucherFields}>
              <Typography variant="subtitle1">
                {t('parameters.voucher')}
              </Typography>
              <div className={classes.inlineField}>
                <PriceInput
                  fullWidth
                  label={t('parameters.recurrent_voucher')}
                  // @ts-expect-error
                  onBlur={this.handleBlurRecurrentVoucher}
                  onChange={this.updateRecurrentVoucher}
                  value={this.state.recurrent_voucher}
                />
              </div>
            </div>
          </div>
          <div className={classes.recap}>
            <RecapSubscription
              dateStart={this.state.first_billing_timestamp * 1000}
              member={member}
              nbPeriod={this.state.nb_interval}
              periodName="month"
              price={recapPrice}
              recurrentVoucher={this.state.recurrent_voucher}
              subscriptionContentName={recapName}
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
          handleCancel={this.handleResetSelection}
          handleConfirm={() =>
            this.setState({
              warnManagerOnInvoice: false,
            })
          }
          open={this.state.warnManagerOnInvoice}
          options={{
            title: 'invoice:invoicePaymentPackTagWarningDialog.title',
            Content: () => (
              <p>{t('invoice:invoicePaymentPackTagWarningDialog.content')}</p>
            ),
          }}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
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
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionCreate);
