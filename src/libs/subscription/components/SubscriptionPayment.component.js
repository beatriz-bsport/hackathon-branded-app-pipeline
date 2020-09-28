// @flow
import React from 'react';

import { compose, withState } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';
import { appliesToContract as appliesToContractAPI } from '../../coupon/api';

import PaymentMethodList from '../../payment/components/PaymentMethodList.component';

const PaymentMethodSwitcher = (props: {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  payment_method: string,
  enabledPaymentMethods: Array<number>,
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.payment_method}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
    ) ? (
      <FormControlLabel
        value="sepa_debit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.sepa')}
        labelPlacement="bottom"
      />
    ) : null}
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    ) ? (
      <FormControlLabel
        value="card"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.card')}
        labelPlacement="bottom"
      />
    ) : null}
    {props.enabledPaymentMethods.includes(
      BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
    ) ? (
      <FormControlLabel
        value="bsport:credit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.bsportCredit')}
        labelPlacement="bottom"
      />
    ) : null}
  </RadioGroup>
);

type Props = {
  onCancel: () => void,
  processing: boolean,
  setPaymentMethod: (string) => void,
  paymentMethod: string,
  enabledPaymentMethods: Array<number>,

  onSubmit: (source: string) => void,

  classes: Object,
  t: TFunction,

  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,

  contract?: Contract,
  withCoupon?: boolean,
  withNote?: boolean,
};

type State = {
  name: string,
  email: string,
  loading: boolean,
};

export class SubscriptionPayment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      voucher: 0,
      note: '',
      coupon_code: '',
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.refreshSavedPaymentMethodList) {
      this.props.refreshSavedPaymentMethodList();
    }
  }

  submit = async () => {
    if (this.props.paymentMethod === 'bsport:credit') {
      this.props.onSubmit('bsport:credit', null, null, null, this.state.note);
    } else {
      this.setState({ loading: true });
      this.props.onSubmit(
        null,
        this.state.selectedSavedPaymentMethodId,
        {
          onSuccess: () => {
            this.setState({
              loading: false,
            });
          },
          onError: () => {
            this.setState({
              loading: false,
            });
          },
        },
        (this.state.voucher && this.state.coupon_code) || null,
        this.state.note,
      );
    }
  };

  render() {
    const {
      paymentMethod,
      t,
      enabledPaymentMethods,
      onCancel,
      processing,
      setPaymentMethod,
      classes,
    } = this.props;
    return (
      <div>
        {this.props.contract && (
          <div className={classes.priceContainer}>
            <Typography variant="h4">
              {`${this.props.contract.recurrent_price -
                (this.state.voucher || 0)} €`}
            </Typography>
          </div>
        )}
        {this.props.withCoupon && (
          <div className={classes.couponContainer}>
            {!!this.state.voucher && (
              <Typography color="textSecondary">
                {`${this.state.coupon_code}   -${this.state.voucher} €`}
              </Typography>
            )}
            <CouponCodeForm
              onSubmit={async (coupon_code) => {
                const { data } = await appliesToContractAPI(
                  coupon_code,
                  this.props.contract.id,
                );
                if (data.can_be_applied) {
                  this.setState({
                    coupon_code,
                    voucher: data.voucher,
                  });
                }
              }}
            />
            <Divider />
          </div>
        )}
        {!!this.props.withNote && (
          <TextField
            fullWidth
            variant="outlined"
            rows={3}
            label={t('subscription:form.note.label')}
            value={this.state.note}
            onChange={(ev) => this.setState({ note: ev.target.value })}
          />
        )}
        <PaymentMethodSwitcher
          classes={classes}
          t={t}
          payment_method={paymentMethod}
          onChange={(value) => {
            setPaymentMethod(value);
            this.setState({ selectedSavedPaymentMethodId: null });
          }}
          enabledPaymentMethods={enabledPaymentMethods}
        />
        <Divider />
        <div className={classes.cardContainer}>
          {paymentMethod === 'bsport:credit' ? (
            <div>
              <Typography className={classes.explainCredit}>
                {t('subscription:paymentMethod.credit.explain')}
              </Typography>
            </div>
          ) : null}
          {['card', 'sepa_debit'].includes(paymentMethod) && (
            <PaymentMethodList
              showEmpty
              isExpanded
              savedPaymentMethodList={this.props.savedPaymentMethodList}
              selectedSavedPaymentMethodId={
                this.state.selectedSavedPaymentMethodId
              }
              requestSetupIntentSecret={this.props.requestSetupIntentSecret}
              refreshSavedPaymentMethodList={
                this.props.refreshSavedPaymentMethodList
              }
              paymentMethodType={paymentMethod}
              onSelect={(selectedSavedPaymentMethodId) =>
                this.setState({
                  selectedSavedPaymentMethodId,
                })
              }
              disabled={this.state.loading || this.props.processing}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={onCancel}
            color="secondary"
            disabled={processing || this.state.loading}
          >
            {t('subscription:form.cancel')}
          </Button>
          <Button
            onClick={this.submit}
            id="stripe-pay"
            color="primary"
            disabled={
              ['sepa_debit', 'card'].includes(paymentMethod) &&
              !this.state.selectedSavedPaymentMethodId
            }
          >
            {this.state.loading || processing ? (
              <CircularProgress />
            ) : (
              t('subscription:form.submit')
            )}
          </Button>
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(2),
  },
  sensitiveDataContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    maxWidth: '80vw',
    width: '100%',
  },
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  nameAndEmailContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  mandate: {
    padding: theme.spacing(2),
  },
  explainCredit: {
    padding: theme.spacing(2),
  },
  priceContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  couponContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
});

export default compose(
  withState('paymentMethod', 'setPaymentMethod', 'sepa_debit'),
  withTranslation(['subscripton']),
  withStyles(styles),
)(SubscriptionPayment);
