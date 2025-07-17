import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { makeStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import QuicksaleAppBar from '#src/libs/quicksale/components/QuicksaleAppBar';
import QuicksaleBasketSummary from '#src/libs/quicksale/components/QuicksaleBasketSummary';
import QuicksaleBasketPriceRecap from '#src/libs/quicksale/components/QuicksaleBasketPriceRecap';
import QuicksaleDeliveryForm from '#src/libs/quicksale/components/QuicksaleDeliveryForm/QuicksaleDeliveryForm.component';
import QuicksalePaymentInfo from '#src/libs/quicksale/components/QuicksalePaymentInfo';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';

import {
  QuicksaleDeliveryType,
  QuicksalePaymentMethod,
} from '#src/libs/quicksale/constants';

import type { Basket, BasketAddress } from '#src/libs/checkout/types';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import type { Member } from '#src/libs/member/types';
import type { OptionCallback } from '#src/state/types';
import type { PaymentGroup } from '#src/libs/payment/types';
import type { StripeReader } from '#src/libs/terminal/types';
import type { Theme } from '#src/libs/theme/types';

type Props = {
  alreadyPaidAmount?: number;
  // (Quicksale MVP): Hide Coupon
  // attachCoupon: (code: string, options?: OptionCallback<Basket>) => void;
  availablePaymentMethods?: QuicksalePaymentMethod[];
  basket?: Basket;
  basketAddress: BasketAddress | null;
  clientSecret?: string;
  deliveryType: QuicksaleDeliveryType;
  editPaymentGroupPrice?: (
    price: number,
    options?: OptionCallback<PaymentGroup>,
  ) => void;
  goBack: () => void;
  instalmentPaymentConfigurationList?: InstalmentPaymentApiWithBasketId[];
  isProcessing?: boolean;
  loading?: boolean;
  member: Member;
  onPaymentSuccess: (callback?: () => void) => void;
  onSelectInstalmentPayment: (
    instalment_payment: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onSignOut?: () => void;
  openMemberAuthenticationModal: () => void;
  paymentGroup?: number;
  paymentGroupPriceCts?: number;
  quicksaleStaffFullName?: string;
  removeCoupon: (data: { checkout_item: string; quantity: number }) => void;
  removeInternalAccountPrepaidLine: (options?: OptionCallback<Basket>) => void;
  selectedPaymentMethod: QuicksalePaymentMethod;
  setBasketAddress: (basketAddress: BasketAddress | null) => void;
  setDeliveryType: (deliveryType: QuicksaleDeliveryType) => void;
  setIsProcessing?: (isProcessing: boolean) => void;
  setLoading?: (loading: boolean) => void;
  setSelectedPaymentMethod: (paymentMethod: QuicksalePaymentMethod) => void;
  stripeReaders?: StripeReader[];
  theme: Theme;
  useInternalAccount: (
    amount: number,
    options?: OptionCallback<Basket>,
  ) => void;
  // (Quicksale MVP): CreditCard and Sepa payment methods disabled
  /*checkItemsBasket?: (options?: OptionCallback<Basket>) => void;
  detachPaymentMethodLoading?: boolean;
  removePaymentMethod?: (
    paymentMethodId: string,
    options?: OptionCallback<Basket>,
  ) => void;*/
};

const QuicksaleCheckout: React.FC<Props> = ({
  alreadyPaidAmount,
  // (Quicksale MVP): Hide Coupon
  // attachCoupon,
  availablePaymentMethods,
  basket,
  basketAddress,
  clientSecret,
  deliveryType,
  editPaymentGroupPrice,
  goBack,
  instalmentPaymentConfigurationList,
  isProcessing,
  loading,
  member,
  onPaymentSuccess,
  onSelectInstalmentPayment,
  onSignOut,
  openMemberAuthenticationModal,
  paymentGroup,
  paymentGroupPriceCts,
  quicksaleStaffFullName,
  removeCoupon,
  removeInternalAccountPrepaidLine,
  selectedPaymentMethod,
  setBasketAddress,
  setDeliveryType,
  setIsProcessing,
  setLoading,
  setSelectedPaymentMethod,
  stripeReaders,
  theme,
  useInternalAccount,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  const [invoiceFootNote, setInvoiceFootNote] = React.useState('');

  const [date, setDate] = React.useState(DateTime.now().toISODate());

  const resetPaymentGroupPrice = React.useCallback(
    () =>
      editPaymentGroupPrice?.(
        basket?.total_price_cts / 100 -
          (alreadyPaidAmount ?? 0) -
          basket?.total_price_prepaid_lines_cts / 100,
      ),
    [
      alreadyPaidAmount,
      basket?.total_price_cts,
      basket?.total_price_prepaid_lines_cts,
      editPaymentGroupPrice,
    ],
  );

  if (!basket || !member) return null;

  return (
    <div className={classes.container}>
      <QuicksaleAppBar
        onSignOut={onSignOut}
        staffFullName={quicksaleStaffFullName}
        theme={theme}
      />

      <Button
        className={classes.goBackButton}
        color="default"
        onClick={goBack}
        startIcon={<ArrowBack />}
        variant="outlined"
      >
        <Typography variant="subtitle2">{t('itemList.goBack')}</Typography>
      </Button>

      <Grid container className={classes.gridContainer} spacing={4}>
        <Grid item sm={4} xs={12}>
          <QuicksaleBasketSummary
            basket={basket}
            date={date}
            invoiceFootNote={invoiceFootNote}
            isExcludingTax={theme.is_tax_excluded_in_marketplace}
            member={member}
            onCouponRemove={removeCoupon}
            openMemberAuthenticationModal={openMemberAuthenticationModal}
            removeInternalAccountPrepaidLine={removeInternalAccountPrepaidLine}
            setDate={setDate}
            setInvoiceFootNote={setInvoiceFootNote}
          />
        </Grid>

        <Grid item className={classes.rightContainer} sm={8} xs={12}>
          <QuicksaleBasketPriceRecap
            // (Quicksale MVP): Hide Coupon
            // attachCoupon={attachCoupon}
            basketTotalPrice={basket?.total_price_cts / 100}
            // (Quicksale MVP): Hide Coupon
            // disableCoupon={member.is_pos}
            internalAccount={basket.total_price_prepaid_lines_cts / 100}
            loading={loading || isProcessing}
            modifiedPrice={
              basket.instalment_payment
                ? basket.total_price_cts / 100 -
                  basket.total_price_prepaid_lines_cts / 100
                : paymentGroupPriceCts / 100
            }
            partialPayment={alreadyPaidAmount}
            setModifiedPrice={editPaymentGroupPrice}
            // (Quicksale MVP): Hide price modification
            /*preventPriceModification={
              member.is_pos || !!basket.instalment_payment
            }*/
          />

          {basket.need_address && (
            <QuicksaleDeliveryForm
              basketAddress={basketAddress}
              deliveryType={deliveryType}
              setBasketAddress={setBasketAddress}
              setDeliveryType={setDeliveryType}
            />
          )}

          <QuicksalePaymentInfo
            availablePaymentMethods={availablePaymentMethods}
            basket={basket}
            clientSecret={clientSecret}
            hasPaymentGroupPriceBeenModified={
              !basket.instalment_payment &&
              paymentGroupPriceCts !==
                basket.total_price_cts -
                  (alreadyPaidAmount ?? 0) -
                  basket.total_price_prepaid_lines_cts
            }
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            instalmentPaymentSelectedId={basket.instalment_payment}
            isMemberPOS={member.is_pos}
            loading={loading}
            onCancel={goBack}
            onPaymentSuccess={onPaymentSuccess}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            openMemberAuthenticationModale={openMemberAuthenticationModal}
            paymentGroup={paymentGroup}
            paymentGroupPriceCts={paymentGroupPriceCts}
            resetPaymentGroupPrice={resetPaymentGroupPrice}
            selectedPaymentMethod={selectedPaymentMethod}
            setIsProcessing={setIsProcessing}
            setLoading={setLoading}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            stripeReaders={stripeReaders}
            // basketId={basket.id}
            // cardBillingDetailsMandatory={theme.force_billing_details_on_cards}
            // checkItemsBasket={checkItemsBasket}
            // detachPaymentMethodLoading={detachPaymentMethodLoading}
            // memberId={basket.member}
            // removePaymentMethod={removePaymentMethod}
          >
            {member.credit_account_balance ? (
              <div className={classes.clientDebt}>
                <Typography variant="h6">{t('checkout.clientDebt')}</Typography>
                {member.is_pos ? (
                  <Alert className={classes.alert} severity="info">
                    {t('checkout.noAnonymousClientDebt')}
                  </Alert>
                ) : (
                  <UseInternalAccountForm
                    asManager
                    creditAccountBalance={
                      member.credit_account_balance -
                      basket.total_price_prepaid_lines_cts / 100
                    }
                    loading={loading || isProcessing}
                    onBasketSubmit={useInternalAccount}
                  />
                )}
              </div>
            ) : null}
          </QuicksalePaymentInfo>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  gridContainer: {
    padding: theme.spacing(0, 3, 0, 1),
  },
  goBackButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    color: theme.palette.grey[600],
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[300]}`,
    height: '40px',
    background: 'white',
    width: 'fit-content',
  },
  rightContainer: {
    marginTop: theme.spacing(2),
    background: 'white',
    borderRadius: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    maxHeight: 'calc(100vh - 156px)',
    overflowY: 'auto',
  },
  buttons: {
    display: 'flex',
    gap: theme.spacing(1),
    alignSelf: 'end',
  },
  alert: {
    alignItems: 'center',
  },
  clientDebt: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default React.memo(QuicksaleCheckout);
