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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation, TFunction } from 'react-i18next';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from '@material-ui/core/Checkbox';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import PaymentMethodList from '../../payment/components/payment-method-list/PaymentMethodList.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { appliesToContract } from '../../coupon/api';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';
import { Moment } from '../../../i18n';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import type { Establishment } from '../../establishment/types';

const PaymentMethodSwitcher = (props: {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  payment_method: string,
  enabledPaymentMethods: Array<number>,
  enabledPaymentGroupMethodIdentifier: Array<number>,
  disabled: boolean,
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.payment_method}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    {(props.enabledPaymentMethods || []).includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
    ) ||
    (props.enabledPaymentGroupMethodIdentifier || []).includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    ) ? (
      <FormControlLabel
        value="sepa_debit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.sepa')}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
    {(props.enabledPaymentMethods || []).includes(
      BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    ) ||
    (props.enabledPaymentGroupMethodIdentifier || []).includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    ) ? (
      <FormControlLabel
        value="card"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.card')}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
    {(props.enabledPaymentMethods || []).includes(
      BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
    ) ? (
      <FormControlLabel
        value="bsport:credit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.bsportCredit')}
        labelPlacement="bottom"
        disabled={props.disabled}
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
  enabledPaymentGroupMethodIdentifier: Array<number>,

  onSubmit: (source: string) => void,

  classes: Object,
  t: TFunction,

  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,

  contract?: Contract,
  withCoupon?: boolean,
  withNote?: boolean,
  detachPaymentMethodLoading: boolean,
  companyId: number,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,

  sepaDefaultName?: string,
  sepaDefaultEmail?: string,
  disabled: boolean,
  acceptContract?: boolean,
  setAcceptContract?: (value: boolean) => void,
  date?: string,
  setDate?: (value: string) => void,
  withGeneralConditions: boolean,
  member?: Member,
  withEstablishment: boolean,
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  enableMultiLocalization: boolean,
};

type State = {
  name: string,
  email: string,
  loading: boolean,
  coupon_code: string,
  voucher: number | null,
  billing_establishment_id: number | null,
  selectedSavedPaymentMethodId: number | null,
};

export class SubscriptionPayment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      voucher: null,
      note: '',
      coupon_code: '',
      loading: false,
      billing_establishment_id: null,
      selectedSavedPaymentMethodId: null,
    };
  }

  componentDidMount() {
    if (this.props.refreshSavedPaymentMethodList) {
      this.props.refreshSavedPaymentMethodList();
    }
    this.handleSelectedPaymentMethod();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.contract !== this.props.contract) {
      this.deleteCoupon();
    }
    if (
      prevProps.savedPaymentMethodList?.length !==
        this.props.savedPaymentMethodList?.length ||
      prevProps.paymentMethod !== this.props.paymentMethod
    ) {
      this.handleSelectedPaymentMethod();
    }
  }

  handleSelectedPaymentMethod = () => {
    const selectedPaymentMethodList = this.props.savedPaymentMethodList?.filter(
      (pm) => pm.type === this.props.paymentMethod,
    );
    if (selectedPaymentMethodList.length) {
      this.setState({
        selectedSavedPaymentMethodId: selectedPaymentMethodList[0].id,
      });
    }
  };

  isZeroPrice = () => {
    if (this.props.contract) {
      return (
        this.props.contract.recurrent_price +
          (this.props.contract.flat_fee || 0) -
          (this.state.voucher || 0) <=
        0
      );
    }
    return false;
  };

  submit = async () => {
    if (this.props.paymentMethod === 'bsport:credit' || this.isZeroPrice()) {
      this.props.onSubmit(
        'bsport:credit',
        null,
        null,
        (this.state.voucher && this.state.coupon_code) || null,
        this.state.note,
        this.state.billing_establishment_id,
      );
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
        this.state.billing_establishment_id,
      );
    }
  };

  applyCoupon = async (coupon_code: string, options: any) => {
    const { data } = await appliesToContract(
      coupon_code,
      this.props.contract.id,
      this.props.member?.id,
    );

    if (data.can_be_applied) {
      this.setState({
        coupon_code,
        voucher: data.voucher,
      });
      if (options && options.onSuccess) options.onSuccess();
    } else if (options && options.onError) options.onError();
  };

  deleteCoupon = () => {
    this.setState({ coupon_code: '', voucher: null });
  };

  render() {
    const {
      paymentMethod,
      t,
      enabledPaymentMethods,
      enabledPaymentGroupMethodIdentifier,
      onCancel,
      processing,
      setPaymentMethod,
      classes,
      acceptContract,
      setAcceptContract,
      date,
      setDate,
      withGeneralConditions,
    } = this.props;

    return (
      <div>
        {withGeneralConditions && (
          <>
            <Typography variant="h4" className={classes.title}>
              {t('contract.actions.subscribe')}
            </Typography>
            <FormControl>
              <FormControlLabel
                label={t('contract.actions.iAcceptGeneralCondition')}
                control={
                  <Checkbox
                    checked={acceptContract}
                    onChange={(ev) => setAcceptContract(ev.target.checked)}
                  />
                }
              />
            </FormControl>
            <div className={classes.buttonDateBlock}>
              <Typography className={classes.buttonLeftText}>
                {t('contract.actions.iwanttostarton')}
              </Typography>
              <div className={classes.column}>
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={Moment}
                  locale={Moment.locale()}
                >
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    format="L"
                    required
                    mask={(value) => {
                      if (value) {
                        return [
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ];
                      }
                      return [];
                    }}
                    returnMoment={false}
                    disablePast
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </>
        )}
        {this.props.contract && (
          <div className={classes.priceContainer}>
            <div className={classes.priceInner}>
              <Typography variant="h4">
                {`${getCurrencyDisplayWithPrice(
                  parseFloat(
                    this.props.contract.recurrent_price -
                      (this.state.voucher || 0),
                  ).toFixed(2),
                )}`}
              </Typography>
              {!!parseInt(this.props.contract.flat_fee, 10) && (
                <Typography variant="caption">
                  {`+${getCurrencyDisplayWithPrice(
                    parseFloat(this.props.contract.flat_fee).toFixed(2),
                  )}`}
                </Typography>
              )}
            </div>
          </div>
        )}
        {this.props.withCoupon && (
          <div className={classes.couponContainer}>
            {!!this.state.voucher && (
              <div className={classes.couponItem}>
                <Typography color="textSecondary">
                  {`${this.state.coupon_code}   -${getCurrencyDisplayWithPrice(
                    (this.state.voucher || 0).toFixed(2),
                  )}`}
                </Typography>
                <IconButton
                  aria-label="delete"
                  onClick={() => this.deleteCoupon()}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            <CouponCodeForm
              onSubmit={this.applyCoupon}
              disabled={this.props.disabled}
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
        {!this.isZeroPrice() && (
          <>
            <PaymentMethodSwitcher
              classes={classes}
              t={t}
              payment_method={paymentMethod}
              onChange={(value) => {
                setPaymentMethod(value);
                this.setState({ selectedSavedPaymentMethodId: null });
              }}
              enabledPaymentMethods={enabledPaymentMethods}
              enabledPaymentGroupMethodIdentifier={
                enabledPaymentGroupMethodIdentifier
              }
              disabled={this.props.disabled}
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
                  onDelete
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
                  disabled={
                    this.state.loading ||
                    this.props.processing ||
                    this.props.disabled
                  }
                  detachPaymentMethodLoading={
                    this.props.detachPaymentMethodLoading
                  }
                  companyId={this.props.companyId}
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  snackbarErrorMsg={this.props.snackbarErrorMsg}
                  snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                  sepaDefaultName={this.props.sepaDefaultName}
                  sepaDefaultEmail={this.props.sepaDefaultEmail}
                />
              )}
            </div>
          </>
        )}
        {this.props.enableMultiLocalization &&
          this.props.withEstablishment &&
          this.props.establishments?.length !== 0 && (
            <div className={classes.establishmentSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                {this.props.t(
                  'invoice:section.invoiceItemList.billing_establishment',
                )}
              </Typography>
              <Divider className={classes.divider} />
              <EstablishmentSelector
                establishments={this.props.establishments}
                isClearable
                isLoading={this.props.establishmentLoading}
                isOptionDisabled
                selectOption={(item: { value: number, label: string }) => {
                  this.setState({
                    billing_establishment_id: item ? item.value : null,
                  });
                }}
                selectedEstablishments={[this.state.billing_establishment_id]}
                noMulti
                closeMenuOnSelect
                targetParentElement
              />
            </div>
          )}
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
              (['sepa_debit', 'card'].includes(paymentMethod) &&
                !this.state.selectedSavedPaymentMethodId &&
                !this.isZeroPrice()) ||
              this.props.disabled
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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(2),
  },
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
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
  priceInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
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
  couponItem: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonDateBlock: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(5),
  },
  buttonLeftText: {
    paddingRight: theme.spacing(1),
  },
  establishmentSection: {
    paddingBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withState(
    'paymentMethod',
    'setPaymentMethod',
    ({ enabledPaymentMethods, enabledPaymentGroupMethodIdentifier }) =>
      (enabledPaymentGroupMethodIdentifier || []).includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      ) ||
      (enabledPaymentMethods || []).includes(
        BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
      )
        ? 'sepa_debit'
        : 'card',
  ),
  withTranslation(['subscription']),
  withStyles(styles),
)(SubscriptionPayment);
