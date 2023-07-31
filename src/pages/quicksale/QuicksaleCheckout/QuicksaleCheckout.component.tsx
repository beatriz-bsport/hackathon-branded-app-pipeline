import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';

import QuicksaleAppBar from '#libs/quicksale/components/QuicksaleAppBar';

import type { Theme } from '#libs/theme/types';
import QuicksaleBasketSummary from '#libs/quicksale/components/QuicksaleBasketSummary';
import QuicksaleBasketPriceRecap from '#libs/quicksale/components/QuicksaleBasketPriceRecap';
import type { Basket, BasketAddress } from '#libs/checkout/types';
import type { Member } from '#libs/member/types';
import type { PaymentGroup } from '#libs/payment/types';

import type { OptionCallback } from '../../../state/types';
import {
  QuicksaleDeliveryType,
  QuicksalePaymentMethod,
} from '#libs/quicksale/constants';
import QuicksaleDeliveryForm from '#libs/quicksale/components/QuicksaleDeliveryForm/QuicksaleDeliveryForm.component';
import QuicksalePaymentInfo from '#libs/quicksale/components/QuicksalePaymentInfo';
import type { StripeReader } from '#libs/terminal/types';
import type { InstalmentPaymentApiWithBasketId } from '#libs/instalment-payment-configuration/types';
import UseInternalAccountForm from '#libs/payment/components/UseInternalAccountForm.component';

type Props = {
  theme: Theme;
  quicksaleStaffFullName?: string;
  onSignOut?: () => void;
  goBack: () => void;
  basket?: Basket;
  member: Member;
  openMemberAuthenticationModal: () => void;
  editPaymentGroupPrice?: (
    price: number,
    options?: OptionCallback<PaymentGroup>,
  ) => void;
  paymentGroup?: number;
  paymentGroupPriceCts?: number;
  alreadyPaidAmount?: number;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  isProcessing?: boolean;
  setIsProcessing?: (isProcessing: boolean) => void;
  removeCoupon: (data: { checkout_item: string; quantity: number }) => void;
  attachCoupon: (code: string, options?: OptionCallback<Basket>) => void;
  basketAddress: BasketAddress | null;
  setBasketAddress: (basketAddress: BasketAddress | null) => void;
  deliveryType: QuicksaleDeliveryType;
  setDeliveryType: (deliveryType: QuicksaleDeliveryType) => void;
  availablePaymentMethods?: QuicksalePaymentMethod[];
  selectedPaymentMethod: QuicksalePaymentMethod;
  setSelectedPaymentMethod: (paymentMethod: QuicksalePaymentMethod) => void;
  stripeReaders?: StripeReader[];
  clientSecret?: string;
  onPaymentSuccess: (callback?: () => void) => void;
  detachPaymentMethodLoading?: boolean;
  removePaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  instalmentPaymentConfigurationList?: InstalmentPaymentApiWithBasketId[];
  onSelectInstalmentPayment: (
    instalment_payment: number,
    options?: OptionCallback<Basket>,
  ) => void;
  useInternalAccount: (
    amount: number,
    options?: OptionCallback<Basket>,
  ) => void;
  removeInternalAccountPrepaidLine: (options?: OptionCallback<Basket>) => void;
};

const QuicksaleCheckout: React.FC<Props> = ({
  theme,
  quicksaleStaffFullName,
  onSignOut,
  goBack,
  basket,
  member,
  openMemberAuthenticationModal,
  editPaymentGroupPrice,
  paymentGroup,
  paymentGroupPriceCts,
  alreadyPaidAmount,
  loading,
  setLoading,
  isProcessing,
  setIsProcessing,
  removeCoupon,
  attachCoupon,
  basketAddress,
  setBasketAddress,
  deliveryType,
  setDeliveryType,
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  stripeReaders,
  clientSecret,
  onPaymentSuccess,
  detachPaymentMethodLoading,
  removePaymentMethod,
  checkItemsBasket,
  instalmentPaymentConfigurationList,
  onSelectInstalmentPayment,
  useInternalAccount,
  removeInternalAccountPrepaidLine,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  const [invoiceFootNote, setInvoiceFootNote] = React.useState('');

  const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'));

  const basketContainsShopItem = React.useMemo(
    () =>
      basket?.checkout_items.some(
        (item) =>
          item.buyable_item_identifier ===
          QuicksaleBasketItem.ShopItemIdentifier,
      ),
    [basket?.checkout_items],
  );

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
        theme={theme}
        staffFullName={quicksaleStaffFullName}
        onSignOut={onSignOut}
      />

      <Button
        color="default"
        variant="outlined"
        startIcon={<ArrowBack />}
        className={classes.goBackButton}
        onClick={goBack}
      >
        <Typography variant="subtitle2">{t('itemList.goBack')}</Typography>
      </Button>

      <Grid container spacing={4} className={classes.gridContainer}>
        <Grid item xs={12} sm={4}>
          <QuicksaleBasketSummary
            basket={basket}
            member={member}
            openMemberAuthenticationModal={openMemberAuthenticationModal}
            date={date}
            setDate={setDate}
            invoiceFootNote={invoiceFootNote}
            setInvoiceFootNote={setInvoiceFootNote}
            onCouponRemove={removeCoupon}
            removeInternalAccountPrepaidLine={removeInternalAccountPrepaidLine}
          />
        </Grid>

        <Grid item xs={12} sm={8} className={classes.rightContainer}>
          <QuicksaleBasketPriceRecap
            basketTotalPrice={basket?.total_price_cts / 100}
            modifiedPrice={
              basket.instalment_payment
                ? basket.total_price_cts / 100 -
                  basket.total_price_prepaid_lines_cts / 100
                : paymentGroupPriceCts / 100
            }
            setModifiedPrice={editPaymentGroupPrice}
            partialPayment={alreadyPaidAmount}
            loading={loading || isProcessing}
            attachCoupon={attachCoupon}
            preventPriceModification={
              member.is_pos || !!basket.instalment_payment
            }
            internalAccount={basket.total_price_prepaid_lines_cts / 100}
          />

          {basketContainsShopItem && (
            <QuicksaleDeliveryForm
              basketAddress={basketAddress}
              setBasketAddress={setBasketAddress}
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
            />
          )}

          <QuicksalePaymentInfo
            basket={basket}
            availablePaymentMethods={availablePaymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            loading={loading}
            stripeReaders={stripeReaders}
            clientSecret={clientSecret}
            paymentGroupPriceCts={paymentGroupPriceCts}
            paymentGroup={paymentGroup}
            setIsProcessing={setIsProcessing}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={goBack}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            removePaymentMethod={removePaymentMethod}
            basketId={basket.id}
            isMemberPOS={member.is_pos}
            memberId={basket.member}
            checkItemsBasket={checkItemsBasket}
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            instalmentPaymentSelectedId={basket.instalment_payment}
            setLoading={setLoading}
            openMemberAuthenticationModale={openMemberAuthenticationModal}
            hasPaymentGroupPriceBeenModified={
              !basket.instalment_payment &&
              paymentGroupPriceCts !==
                basket.total_price_cts -
                  (alreadyPaidAmount ?? 0) -
                  basket.total_price_prepaid_lines_cts
            }
            resetPaymentGroupPrice={resetPaymentGroupPrice}
          >
            {member.credit_account_balance ? (
              <div className={classes.clientDebt}>
                <Typography variant="h6">{t('checkout.clientDebt')}</Typography>
                {member.is_pos ? (
                  <Alert severity="info" className={classes.alert}>
                    {t('checkout.noAnonymousClientDebt')}
                  </Alert>
                ) : (
                  <UseInternalAccountForm
                    onBasketSubmit={useInternalAccount}
                    creditAccountBalance={
                      member.credit_account_balance -
                      basket.total_price_prepaid_lines_cts / 100
                    }
                    loading={loading || isProcessing}
                    asManager
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
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(
      1,
    )}px`,
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
