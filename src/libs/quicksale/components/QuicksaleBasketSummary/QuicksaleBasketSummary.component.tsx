import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Event from '@material-ui/icons/Event';
import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';

import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items';

import type { Basket, CheckoutItem } from '#libs/checkout/types';
import type { Member } from '#libs/member/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getBasketTotalPriceExcludingTax } from '#libs/checkout/utils';
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
      <Typography variant="body2" className={classes.textGrey600}>
        {coupon.name}
      </Typography>

      <div className={classes.couponActions}>
        <Typography variant="subtitle2" className={classes.fontWeight500}>
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
  setInvoiceFootNote: (note: string) => void;
  onCouponRemove: (data: { checkout_item: string; quantity: number }) => void;
  removeInternalAccountPrepaidLine: (options?: OptionCallback<Basket>) => void;
};

const QuicksaleBasketSummary: React.FC<Props> = ({
  basket,
  member,
  openMemberAuthenticationModal,
  date,
  setDate,
  invoiceFootNote,
  setInvoiceFootNote,
  onCouponRemove,
  removeInternalAccountPrepaidLine,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();

  // For now, the footnote and the billing date of the invoice
  // are not used since the backend is not ready for it
  const showInvoiceInformation = false;

  const canChangeMember = !!basket && !basket.invoice;

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
    (newDate) => {
      setDate(moment(newDate).format('YYYY-MM-DD'));
    },
    [setDate],
  );

  const removePrepaidLine = React.useCallback(
    () => removeInternalAccountPrepaidLine(),
    [removeInternalAccountPrepaidLine],
  );

  if (!basket) return <></>;

  const basketPriceExcludingTax = getBasketTotalPriceExcludingTax(basket, true);

  const taxPrice = (
    parseFloat(basket.total_price) -
    parseFloat(basketPriceExcludingTax) -
    deliveryFee?.unit_price
  ).toFixed(2);

  return (
    <div className={classes.container}>
      <BasketName
        member={member}
        canChangeMember={canChangeMember}
        openChangeMemberModal={openMemberAuthenticationModal}
      />

      {member?.is_pos ? (
        <Alert severity="warning" className={classes.unauthenticatedAlert}>
          {t('checkout.unauthenticatedWarning')}
        </Alert>
      ) : null}

      {showInvoiceInformation && (
        <DateInput
          value={date}
          onChange={onChangeDate}
          label={t('checkout.billingDate')}
          className={classes.datePicker}
          endAdornment={<Event className={classes.icon} />}
        />
      )}

      <Divider className={classes.divider} />

      <div className={classes.objectList}>
        {displayableCheckoutItems.map((checkoutItem) => (
          <div key={checkoutItem.id} className={classes.checkoutItem}>
            <div className={classes.checkoutItemQuantityAndName}>
              <div className={classes.checkoutItemQuantity}>
                <Typography
                  variant="subtitle2"
                  className={classes.fontWeight500}
                >
                  {checkoutItem.quantity}
                </Typography>
              </div>

              <Typography variant="subtitle2" className={classes.fontWeight500}>
                {checkoutItem.name}
              </Typography>
            </div>

            <Typography variant="subtitle2" className={classes.fontWeight500}>
              {getCurrencyDisplayWithPrice(
                checkoutItem.unit_price * checkoutItem.quantity,
              )}
            </Typography>
          </div>
        ))}
      </div>

      <Divider className={classes.divider} />

      <div className={classes.prices}>
        <div className={classes.priceExcludingTax}>
          <Typography variant="body2" className={classes.textGrey600}>
            {t('checkout.priceExcludingTax')}
          </Typography>

          <Typography variant="subtitle2" className={classes.fontWeight500}>
            {getCurrencyDisplayWithPrice(basketPriceExcludingTax)}
          </Typography>
        </div>

        <div className={classes.tax}>
          <Typography variant="body2" className={classes.textGrey600}>
            {t('checkout.tax')}
          </Typography>

          <Typography variant="subtitle2" className={classes.fontWeight500}>
            {getCurrencyDisplayWithPrice(taxPrice)}
          </Typography>
        </div>

        {deliveryFee ? (
          <div className={classes.additionalLine}>
            <Typography variant="body2" className={classes.textGrey600}>
              {t('checkout.deliveryFee')}
            </Typography>

            <Typography variant="subtitle2" className={classes.fontWeight500}>
              {getCurrencyDisplayWithPrice(deliveryFee.unit_price)}
            </Typography>
          </div>
        ) : null}

        {coupons?.length
          ? coupons.map((coupon) => (
              <Coupon
                coupon={coupon}
                onCouponRemove={onCouponRemove}
                key={coupon.id}
              />
            ))
          : null}

        {basket?.total_price_prepaid_lines_cts ? (
          <div className={classes.additionalLine}>
            <Typography variant="body2" className={classes.textGrey600}>
              {t('checkout.internalCredits')}
            </Typography>

            <div className={classes.internalCredit}>
              <Typography variant="subtitle2" className={classes.fontWeight500}>
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
          <Typography variant="subtitle1" className={classes.fontWeight500}>
            {t('checkout.priceIncludingTax')}
          </Typography>

          <Typography variant="h6" className={classes.fontWeight500}>
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
            value={invoiceFootNote}
            onChange={onFootNoteChange}
            fullWidth
            variant="outlined"
            label={t('checkout.invoiceFootNote')}
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
          />
        </>
      )}
    </div>
  );
};

export default React.memo(QuicksaleBasketSummary);
