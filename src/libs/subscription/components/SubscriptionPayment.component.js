// @flow
import React from 'react';

import { compose, withState } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
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
      this.props.onSubmit('bsport:credit');
    } else {
      this.setState({ loading: true });
      this.props.onSubmit(null, this.state.selectedSavedPaymentMethodId, {
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
      });
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
});

export default compose(
  withState('paymentMethod', 'setPaymentMethod', 'sepa_debit'),
  withTranslation(['subscripton']),
  withStyles(styles),
)(SubscriptionPayment);
