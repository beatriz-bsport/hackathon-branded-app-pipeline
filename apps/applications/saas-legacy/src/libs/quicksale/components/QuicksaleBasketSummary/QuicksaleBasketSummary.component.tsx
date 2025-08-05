import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Event from '@material-ui/icons/Event';
import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';

import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items.js';

import type { Basket, CheckoutItem } from '#src/libs/checkout/types';
import type { Member } from '#src/libs/member/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getSubTotal } from '#src/libs/checkout/utils';
import DateInput from '../../../../components/input/DateInput.component';

import { BasketName } from '../QuicksaleBasketPanel';
import useStyles from './styles';
import type { OptionCallback } from '../../../../state/types';

type CouponProps = {
  coupon: CheckoutItem;
  onCouponRemove: (data: { checkout_item: string; quantity: number }) => void;
};

const Coupon: React.FC<CouponProps> = ({ coupon, onCouponRemove }) => {
  const removeCoupon = React.useCallback(() => {
    onCouponRemove({ checkout_item: coupon.id, quantity: coupon.quantity });
  }, [onCouponRemove, coupon]);

  const classes = useStyles();

  return (
    <div className={classes.additionalLine}>
      <Typography className={classes.textGrey600} variant="body2">
        {coupon.name}
      </Typography>

      <div className={classes.couponActions}>
        <Typography className={classes.fontWeight500} variant="subtitle2">
          {getCurrencyDisplayWithPrice(coupon.unit_price)}
        </Typography>

        <IconButton className={classes.iconButton} onClick={removeCoupon}>
          <Delete className={classes.icon} />
        </IconButton>
      </div>
    </div>
  );
};

type Props = {
  basket?: Basket;
  member?: Member;
  openMemberAuthenticationModal: () => void;
  date: string;
  setDate: (date: string) => void;
  invoiceFootNote: string;
  isProcessing?: boolean;
  setInvoiceFootNote: (note: string) => void;
  onCouponRemove: (data: { checkout_item: string; quantity: number }) => void;
  removeInternalAccountPrepaidLine: (options?: OptionCallback<Basket>) => void;
  isExcludingTax?: boolean;
};

const QuicksaleBasketSummary: React.FC<Props> = ({
  basket,
  member,
  openMemberAuthenticationModal,
  date,
  setDate,
  invoiceFootNote,
  isProcessing,
  setInvoiceFootNote,
  onCouponRemove,
  removeInternalAccountPrepaidLine,
  isExcludingTax,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();

  // For now, the footnote and the billing date of the invoice
  // are not used since the backend is not ready for it
  const showInvoiceInformation = false;

  const canChangeMember = !!basket && !basket.invoice && !isProcessing;

  const onFootNoteChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setInvoiceFootNote(e.target.value),
    [setInvoiceFootNote],
  );

  const clearFootNote = React.useCallback(
    () => setInvoiceFootNote(''),
    [setInvoiceFootNote],
  );

  const displayableCheckoutItems = React.useMemo(
    () =>
      basket?.checkout_items?.filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier !== BUYABLE_ITEM_COUPON &&
          checkoutItem.buyable_item_identifier !== BUYABLE_ITEM_FEE,
      ),
    [basket?.checkout_items],
  );

  const coupons = React.useMemo(
    () =>
      basket?.checkout_items?.filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_COUPON,
      ),
    [basket?.checkout_items],
  );

  const deliveryFee = React.useMemo(
    () =>
      basket?.checkout_items?.find(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_FEE,
      ),
    [basket?.checkout_items],
  );

  const onChangeDate = React.useCallback(
    (newDate: DateTime) => {
      setDate(newDate.toISODate());
    },
    [setDate],
  );

  const removePrepaidLine = React.useCallback(
    () => removeInternalAccountPrepaidLine(),
    [removeInternalAccountPrepaidLine],
  );

  if (!basket) return <></>;

  const basketPriceExcludingTax = getSubTotal(basket, true);

  const taxPrice = (
    parseFloat(basket.total_price) -
    parseFloat(basketPriceExcludingTax) -
    (deliveryFee?.unit_price ?? 0)
  ).toFixed(2);

  return (
    <div className={classes.container}>
      <BasketName
        canChangeMember={canChangeMember}
        member={member}
        openChangeMemberModal={openMemberAuthenticationModal}
      />

      {showInvoiceInformation && (
        <DateInput
          className={classes.datePicker}
          endAdornment={<Event className={classes.icon} />}
          label={t('checkout.billingDate')}
          onChange={onChangeDate}
          value={DateTime.fromISO(date)}
        />
      )}

      <Divider className={classes.divider} />

      <div className={classes.objectList}>
        {displayableCheckoutItems.map((checkoutItem) => (
          <div key={checkoutItem.id} className={classes.checkoutItem}>
            <div className={classes.checkoutItemQuantityAndName}>
              <div className={classes.checkoutItemQuantity}>
                <Typography
                  className={classes.fontWeight500}
                  variant="subtitle2"
                >
                  {checkoutItem.quantity}
                </Typography>
              </div>

              <Typography className={classes.fontWeight500} variant="subtitle2">
                {checkoutItem.name}
              </Typography>
            </div>

            <Typography className={classes.fontWeight500} variant="subtitle2">
              {getCurrencyDisplayWithPrice(
                checkoutItem.unit_price * checkoutItem.quantity,
                isExcludingTax,
                checkoutItem.tax,
              )}
            </Typography>
          </div>
        ))}
      </div>

      <Divider className={classes.divider} />

      <div className={classes.prices}>
        <div className={classes.priceExcludingTax}>
          <Typography className={classes.textGrey600} variant="body2">
            {t('checkout.priceExcludingTax')}
          </Typography>

          <Typography className={classes.fontWeight500} variant="subtitle2">
            {getCurrencyDisplayWithPrice(basketPriceExcludingTax)}
          </Typography>
        </div>

        <div className={classes.tax}>
          <Typography className={classes.textGrey600} variant="body2">
            {t('checkout.tax')}
          </Typography>

          <Typography className={classes.fontWeight500} variant="subtitle2">
            {getCurrencyDisplayWithPrice(taxPrice)}
          </Typography>
        </div>

        {deliveryFee ? (
          <div className={classes.additionalLine}>
            <Typography className={classes.textGrey600} variant="body2">
              {t('checkout.deliveryFee')}
            </Typography>

            <Typography className={classes.fontWeight500} variant="subtitle2">
              {getCurrencyDisplayWithPrice(deliveryFee.unit_price)}
            </Typography>
          </div>
        ) : null}

        {coupons?.length
          ? coupons.map((coupon) => (
              <Coupon
                key={coupon.id}
                coupon={coupon}
                onCouponRemove={onCouponRemove}
              />
            ))
          : null}

        {basket?.total_price_prepaid_lines_cts ? (
          <div className={classes.additionalLine}>
            <Typography className={classes.textGrey600} variant="body2">
              {t('checkout.internalCredits')}
            </Typography>

            <div className={classes.internalCredit}>
              <Typography className={classes.fontWeight500} variant="subtitle2">
                -
                {getCurrencyDisplayWithPrice(
                  basket?.total_price_prepaid_lines_cts / 100,
                )}
              </Typography>

              <IconButton
                className={classes.iconButton}
                onClick={removePrepaidLine}
              >
                <Delete className={classes.icon} />
              </IconButton>
            </div>
          </div>
        ) : null}

        <div className={classes.total}>
          <Typography className={classes.fontWeight500} variant="subtitle1">
            {t('checkout.priceIncludingTax')}
          </Typography>

          <Typography className={classes.fontWeight500} variant="h6">
            {getCurrencyDisplayWithPrice(
              (
                parseFloat(basket.total_price) -
                parseFloat(basket.total_price_prepaid_lines)
              ).toFixed(2),
            )}
          </Typography>
        </div>
      </div>

      {showInvoiceInformation && (
        <>
          <Divider className={classes.divider} />
          <TextField
            fullWidth
            InputProps={
              invoiceFootNote.length
                ? {
                    endAdornment: (
                      <IconButton
                        className={classes.iconButton}
                        onClick={clearFootNote}
                      >
                        <Cancel className={classes.icon} />
                      </IconButton>
                    ),
                  }
                : {}
            }
            label={t('checkout.invoiceFootNote')}
            onChange={onFootNoteChange}
            value={invoiceFootNote}
            variant="outlined"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(QuicksaleBasketSummary);
