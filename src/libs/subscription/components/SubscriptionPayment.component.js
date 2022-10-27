// @flow
import React from 'react';

import { compose, withState } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment-timezone';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withTranslation, TFunction } from 'react-i18next';
import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA } from '@bsport/common/lib/master-data/subscription-payment-methods';
import Select from '@material-ui/core/Select';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
} from '@bsport/common/lib/master-data/payment-group';

import FormControl from '@material-ui/core/FormControl';
import { Alert } from '@material-ui/lab';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import PaymentMethodSwitcher from '../../payment/components/PaymentMethodSwitcher.component';
import PaymentMethodList from '../../payment/components/payment-method-list/PaymentMethodList.component';
import PaymentStripeTerminalWrapper from '#libs/terminal/components/PaymentStripeTerminalWrapper.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { appliesToContract } from '../../coupon/api';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';
import { Moment } from '../../../i18n';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import type { Establishment } from '../../establishment/types';
import BasketTaxInfo from '#libs/checkout/components/BasketTaxInfo.component';
import { getPrice, getTaxPrice } from '../../theme/utils';
import type { SubscriptionData } from '../types';
import type { StripeReader } from '#libs/terminal/types';
import NumericInput from '#components/input/NumericInput.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

const MANUAL_PAYMENT_METHOD_FOR_PAST_INVOICES = '0';
const SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES = '1';

type Props = {
  onCancel: () => void,
  processing: boolean,
  setPaymentMethod: (string) => void,
  paymentMethod: string,
  enabledPaymentMethods: Array<number>,
  enabledPaymentGroupMethodIdentifier: Array<number>,
  subscriptionData: SubscriptionData,

  onSubmit: (source: string) => void,

  classes: Object,
  t: TFunction,

  requestSetupIntentSecret: () => Promise<any>,
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
  memberId?: number,
  isExcludingTax?: boolean,
  stripeReaders: StripeReader[],
  companyId?: number,

  pastInvoices: boolean,
  onlinePaymentEnabled?: boolean,
  forceEstablishmentSelection?: boolean,
};

type State = {
  name: string,
  email: string,
  loading: boolean,
  coupon_code: string,
  voucher: number | null,
  billing_establishment_id: number | null,
  selectedSavedPaymentMethodId: number | null,
  processingTerminal: boolean,
  requiredEstablishmentIsMissing: boolean,
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
      processingTerminal: false,
      paymentMethodForPastInvoices: SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES,
      manualPaymentMethodForPastInvoices: PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
      lastConfirmDifferentMonth: false,
      amountValuePastInvoices: 0,
      errorValuePastInvoices: false,
      theoricalAmountValuePastInvoices: null,
      requiredEstablishmentIsMissing: false,
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
      prevProps.date !== this.props.date ||
      prevProps.subscriptionData !== this.props.subscriptionData ||
      prevProps?.contract !== this.props.contract
    ) {
      this.setState({
        theoricalAmountValuePastInvoices:
          Math.ceil(
            Math.abs(moment(this.props.date).diff(moment(), 'months', true)),
          ) *
            parseFloat(
              this.props?.contract?.recurrent_price ||
                this.props?.subscriptionData?.recurrent_price,
            ) +
          parseFloat(
            this.props?.contract?.flat_fee ||
              this.props?.subscriptionData?.flat_fee ||
              0,
          ),
      });
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

  handleChangePaymentMethodForPastInvoices = (event) => {
    this.setState({ paymentMethodForPastInvoices: event.target.value });
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

  submit = async (pastMonth?: boolean) => {
    if (
      this.state.amountValuePastInvoices !==
        Number(this.state.theoricalAmountValuePastInvoices) &&
      pastMonth
    ) {
      this.setState({ errorValuePastInvoices: true });
      return;
    }
    if (
      this.props.forceEstablishmentSelection &&
      this.props.enableMultiLocalization &&
      !this.state.billing_establishment_id &&
      this.props.establishments?.length
    ) {
      this.setState({ requiredEstablishmentIsMissing: true });
      return;
    }
    this.setState({ lastConfirmDifferentMonth: false });
    if (this.props.paymentMethod === 'bsport:credit' || this.isZeroPrice()) {
      this.props.onSubmit(
        'bsport:credit',
        null,
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES,
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES
          ? this.state.selectedSavedPaymentMethodId
          : this.state.manualPaymentMethodForPastInvoices,
        null,
        (this.state.voucher && this.state.coupon_code) || null,
        this.state.note,
        this.state.billing_establishment_id,
      );
    } else if (this.props.paymentMethod === 'terminal') {
      this.setState({ loading: true });
      this.props.onSubmit(
        null,
        'stripe_terminal',
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES,
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES
          ? this.state.selectedSavedPaymentMethodId
          : this.state.manualPaymentMethodForPastInvoices,
        {
          onSuccess: () => {
            this.setState({
              loading: false,
            });
            if (this.props.refreshSavedPaymentMethodList) {
              this.props.refreshSavedPaymentMethodList();
            }
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
    } else {
      this.setState({ loading: true });
      this.props.onSubmit(
        null,
        this.state.selectedSavedPaymentMethodId,
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES,
        this.state.paymentMethodForPastInvoices ===
          SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES
          ? this.state.selectedSavedPaymentMethodId
          : this.state.manualPaymentMethodForPastInvoices,
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
    await appliesToContract(
      coupon_code,
      this.props.contract.id,
      this.props.member?.id || this.props.memberId,
    )
      .then(({ data }) => {
        if (data.can_be_applied) {
          this.setState({
            coupon_code,
            voucher: data.voucher,
          });
          if (options && options.onSuccess) options.onSuccess();
        } else if (options && options.onError) options.onError();
      })
      .catch(() => {
        if (options && options.onNotFound) options.onNotFound();
      });
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
          <>
            {this.props.isExcludingTax && (
              <BasketTaxInfo
                excludingTaxPrice={getPrice(
                  this.props.contract.recurrent_price,
                  true,
                  this.props.contract.tax,
                )}
                flat_fee={getPrice(
                  this.props.contract.flat_fee,
                  true,
                  this.props.contract.tax,
                )}
                taxPrice={
                  parseFloat(
                    getTaxPrice(
                      this.props.contract.recurrent_price,
                      this.props.contract.tax,
                    ),
                  ) +
                  parseFloat(
                    getTaxPrice(
                      this.props.contract.flat_fee,
                      this.props.contract.tax,
                    ),
                  )
                }
              />
            )}
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
          </>
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
              paymentMethod={paymentMethod}
              onChange={(value) => {
                setPaymentMethod(value);
                this.setState({ selectedSavedPaymentMethodId: null });
              }}
              enabledPaymentMethods={enabledPaymentMethods}
              onlinePaymentEnabled={this.props.onlinePaymentEnabled}
              enabledPaymentGroupMethodIdentifier={
                enabledPaymentGroupMethodIdentifier
              }
              disabled={this.props.disabled || this.state.processingTerminal}
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
              {paymentMethod === 'terminal' && (
                <div className={classes.terminalContainer}>
                  <PaymentStripeTerminalWrapper
                    stripeReaders={this.props.stripeReaders}
                    requestSetupIntentSecret={
                      this.props.requestSetupIntentSecret
                    }
                    onCancel={onCancel}
                    onSuccess={this.submit}
                    setProcessing={(value: boolean) =>
                      this.setState({ processingTerminal: value })
                    }
                    isSetupIntent
                    companyId={this.props.companyId}
                  />
                </div>
              )}
              {['card', 'sepa_debit'].includes(paymentMethod) &&
                !(this.props.onlinePaymentEnabled === false) && (
                  <PaymentMethodList
                    showEmpty
                    isExpanded
                    onDelete
                    savedPaymentMethodList={this.props.savedPaymentMethodList}
                    selectedSavedPaymentMethodId={
                      this.state.selectedSavedPaymentMethodId
                    }
                    requestSetupIntentSecret={
                      this.props.requestSetupIntentSecret
                    }
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
                      this.props.disabled ||
                      this.props.onlinePaymentEnabled === false
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
                isClearable={!this.props.forceEstablishmentSelection}
                isLoading={this.props.establishmentLoading}
                isOptionDisabled
                selectOption={(item: { value: number, label: string }) => {
                  this.setState({
                    billing_establishment_id: item ? item.value : null,
                    requiredEstablishmentIsMissing: !item,
                  });
                }}
                selectedEstablishments={[this.state.billing_establishment_id]}
                noMulti
                closeMenuOnSelect
                targetParentElement
                isRequired={this.props.forceEstablishmentSelection}
                requiredValueIsMissing={
                  this.state.requiredEstablishmentIsMissing
                }
              />
            </div>
          )}
        {this.props.pastInvoices && (
          <div className={classes.pastInvoicesContent}>
            <Typography variant="h6">
              {this.props.t(
                'subscription:contract.pastDate.payment.pastInvoicesPayment',
              )}
            </Typography>
            <RadioGroup
              aria-label="displayType"
              name="displayType"
              value={this.state.paymentMethodForPastInvoices}
              onChange={this.handleChangePaymentMethodForPastInvoices}
            >
              <FormControlLabel
                value={SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES}
                control={<Radio />}
                label={this.props.t(
                  'subscription:contract.pastDate.payment.registeredMethodPayment',
                )}
              />
              <FormControlLabel
                value={MANUAL_PAYMENT_METHOD_FOR_PAST_INVOICES}
                control={<Radio />}
                label={this.props.t(
                  'subscription:contract.pastDate.payment.manualPayment',
                )}
              />
            </RadioGroup>
            {this.state.paymentMethodForPastInvoices ===
              MANUAL_PAYMENT_METHOD_FOR_PAST_INVOICES && (
              <Alert severity="info">
                {this.props.t(
                  'subscription:contract.pastDate.payment.manualInfo',
                )}
              </Alert>
            )}
            {this.state.paymentMethodForPastInvoices ===
              MANUAL_PAYMENT_METHOD_FOR_PAST_INVOICES && (
              <FormControl className={classes.field}>
                <Select
                  id="payment-method-select"
                  value={this.state.manualPaymentMethodForPastInvoices}
                  fullWidth
                  onChange={(ev) => {
                    this.setState({
                      manualPaymentMethodForPastInvoices: ev.target.value,
                    });
                  }}
                >
                  {PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT].filter(
                    (pm) => pm !== PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
                  ).map((pm) => (
                    <MenuItem fullWidth value={pm}>
                      {t(`invoice:paymentMethod.label.${pm}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {this.state.paymentMethodForPastInvoices ===
              SAVED_PAYMENT_METHOD_FOR_PAST_INVOICES && (
              <Alert severity="info">
                {this.props.t(
                  'subscription:contract.pastDate.payment.registeredInfo',
                )}
              </Alert>
            )}
          </div>
        )}
        {paymentMethod !== 'terminal' && (
          <div className={classes.buttonContainer}>
            <Button
              onClick={onCancel}
              color="secondary"
              disabled={processing || this.state.loading}
            >
              {t('subscription:form.cancel')}
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  lastConfirmDifferentMonth: !moment(this.props.date).isSame(
                    moment(),
                    'month',
                  ),
                });
                if (moment(this.props.date).isSameOrAfter(moment(), 'month')) {
                  this.submit();
                }
              }}
              id="stripe-pay"
              color="primary"
              variant="contained"
              disabled={
                (['sepa_debit', 'card'].includes(paymentMethod) &&
                  !this.state.selectedSavedPaymentMethodId &&
                  !this.isZeroPrice()) ||
                this.props.disabled ||
                this.state.loading ||
                processing
              }
            >
              {this.state.loading || processing ? (
                <CircularProgress color="inherit" />
              ) : (
                t('subscription:form.submit')
              )}
            </Button>
          </div>
        )}
        <GenericResponsiveDialog
          open={this.props.pastInvoices && this.state.lastConfirmDifferentMonth}
          maxWidth="sm"
        >
          <DialogTitle>{this.props.t('contract.pastDate.title')}</DialogTitle>
          <DialogContent className={classes.alertContentDifferentMonth}>
            <Alert severity="error" variant="outlined">
              {this.props.t('contract.pastDate.alertDifferentMonthConfirmAsk', {
                valuePastInvoices: this.state.theoricalAmountValuePastInvoices,
                valuePastInvoicesPrice: getCurrencyDisplayWithPrice(
                  this.state.theoricalAmountValuePastInvoices,
                ),
              })}
            </Alert>
            <NumericInput
              required
              label={this.props.t('contract.pastDate.alertDifferentMonthInput')}
              helperText={
                this.state.errorValuePastInvoices &&
                this.props.t('contract.pastDate.valuePastInvoicesInputError')
              }
              error={this.state.errorValuePastInvoices}
              onChange={(event) =>
                this.setState({
                  amountValuePastInvoices: Number(event.target.value),
                })
              }
              className={classes.confirmValue}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ lastConfirmDifferentMonth: false });
              }}
              color="secondary"
            >
              {this.props.t('contract.pastDate.cancel')}
            </Button>
            <Button
              onClick={() => {
                this.submit(true);
              }}
              variant="contained"
              color="primary"
            >
              {this.props.t('contract.pastDate.validate')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  terminalContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
  pastInvoicesContent: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  alertContentDifferentMonth: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  confirmValue: { maxWidth: '150px' },
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
