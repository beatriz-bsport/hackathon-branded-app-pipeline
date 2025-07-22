import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';

import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';
// import CouponCodeForm from '#src/libs/coupon/components/CouponCodeForm.component';
import type { PaymentGroup } from '#src/libs/payment/types';
// import type { Basket } from '#src/libs/checkout/types';
import type { OptionCallback } from '#src/state/types';

import useStyles from './styles';

type Props = {
  // (Quicksale MVP): Hide Coupon
  // attachCoupon: (code: string, options?: OptionCallback<Basket>) => void;
  basketTotalPrice?: number;
  // (Quicksale MVP): Hide Coupon
  // disableCoupon?: boolean;
  internalAccount?: number;
  loading?: boolean;
  modifiedPrice?: number;
  partialPayment?: number;
  setModifiedPrice?: (
    price: number,
    options?: OptionCallback<PaymentGroup>,
  ) => void;
  // (Quicksale MVP): Hide price modification
  // preventPriceModification?: boolean;
};

const QuicksaleBasketPriceRecap: React.FC<Props> = ({
  // (Quicksale MVP): Hide Coupon
  // attachCoupon,
  basketTotalPrice,
  // (Quicksale MVP): Hide Coupon
  // disableCoupon,
  internalAccount,
  loading,
  modifiedPrice,
  partialPayment,
  setModifiedPrice,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  const basketPriceLeftToPay =
    (basketTotalPrice ?? 0) - (partialPayment ?? 0) - (internalAccount ?? 0);

  const [isEditingPrice, setIsEditingPrice] = useState(false);

  // (Quicksale MVP) Hide edit price button, keep for future use
  /*const startEditingPrice = useCallback(() => {
    setIsEditingPrice(true);
  }, []);*/

  const [newPrice, setNewPrice] = useState(0);

  const onPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPrice(Number(e.target.value));
    },
    [setNewPrice],
  );

  const saveNewPrice = useCallback(() => {
    if (basketTotalPrice == null || !setModifiedPrice) return;

    const priceToSet = Number(newPrice.toFixed(2));
    if (
      priceToSet <= 0 ||
      priceToSet > (basketTotalPrice ?? 0) - (partialPayment ?? 0)
    ) {
      if (modifiedPrice !== basketPriceLeftToPay)
        setModifiedPrice(basketPriceLeftToPay);
    } else if (modifiedPrice !== priceToSet) setModifiedPrice(priceToSet);
    setIsEditingPrice(false);
    setNewPrice(0);
  }, [
    basketPriceLeftToPay,
    basketTotalPrice,
    modifiedPrice,
    newPrice,
    partialPayment,
    setModifiedPrice,
  ]);

  const cancelNewPrice = useCallback(() => {
    setNewPrice(0);
    if (setModifiedPrice && modifiedPrice !== basketPriceLeftToPay)
      setModifiedPrice(basketPriceLeftToPay);
    setIsEditingPrice(false);
  }, [basketPriceLeftToPay, modifiedPrice, setModifiedPrice]);

  /*(Quicksale MVP): Hide Coupon
  // const addCoupon = useCallback(
  //   (code: string, options?: OptionCallback) => {
  //     attachCoupon(code, {
  //       onSuccess: (newBasket) => {
  //         if (
  //           setModifiedPrice &&
  //           newBasket &&
  //           modifiedPrice !== basketPriceLeftToPay
  //         )
  //           setModifiedPrice(
  //             newBasket.total_price_cts / 100 - (partialPayment ?? 0),
  //           );
  //         options?.onSuccess?.();
  //       },
  //       onError: options?.onError,
  //     });
  //   },
  //   [
  //     attachCoupon,
  //     basketPriceLeftToPay,
  //     modifiedPrice,
  //     partialPayment,
  //     setModifiedPrice,
  //   ],
  */

  if (!basketTotalPrice) return <></>;

  return (
    <div className={classes.container}>
      <Typography className={classes.fontWeight500} variant="h6">
        {t('checkout.priceRecap')}
      </Typography>

      {/* (Quicksale MVP): Hide the recap line for now, we deprecated the partial payment feature. */}
      {/*{!loading && basketPriceLeftToPay !== modifiedPrice && (
        <div className={classes.recapLine}>
          <Typography variant="caption">{t('checkout.amountDue')}</Typography>
          <div className={classes.line} />
          <Typography variant="caption">
            {getCurrencyDisplayWithPrice(basketPriceLeftToPay)}
          </Typography>
        </div>
      )}

      {!!partialPayment && (
        <>
          <div className={classes.recapLine}>
            <Typography variant="caption">
              {t('checkout.partialPayment')}
            </Typography>
            <div className={classes.line} />
            <Typography variant="caption">
              {getCurrencyDisplayWithPrice(partialPayment)}
            </Typography>
          </div>

          <div className={classes.recapLine}>
            <Typography variant="caption">{t('checkout.leftToPay')}</Typography>
            <div className={classes.line} />
            <Typography variant="caption">
              {getCurrencyDisplayWithPrice(basketPriceLeftToPay)}
            </Typography>
          </div>
        </>
      )}*/}

      <div className={classes.priceFrame}>
        {isEditingPrice ? (
          <div className={classes.price}>
            <Input
              autoFocus
              onChange={onPriceChange}
              startAdornment={
                <InputAdornment position="start">
                  {getCurrencyDisplay()}
                </InputAdornment>
              }
              value={newPrice}
            />
            <Save className={classes.primaryIcon} onClick={saveNewPrice} />
            <Close className={classes.grayIcon} onClick={cancelNewPrice} />
          </div>
        ) : (
          <div className={classes.price}>
            <Typography variant="h6">
              {getCurrencyDisplayWithPrice(
                modifiedPrice ?? basketPriceLeftToPay,
              )}
            </Typography>
            {/*
              (Quicksale MVP): Hide the edit price button to avoid edge cases with partial payments and price editing.
              The code is left in place for future use, but the button is not rendered.
              To re-enable, restore the IconButton below.
            
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton
                className={classes.iconButton}
                disabled={preventPriceModification}
                onClick={startEditingPrice}
              >
                <Create
                  className={
                    preventPriceModification
                      ? classes.grayIcon
                      : classes.primaryIcon
                  }
                />
              </IconButton>
            )}
            */}
          </div>
        )}

        {!loading && modifiedPrice !== basketPriceLeftToPay && (
          <Typography variant="caption">
            {`${t('checkout.leftDue')} ${getCurrencyDisplayWithPrice(
              basketPriceLeftToPay - (modifiedPrice ?? 0),
            )}`}
          </Typography>
        )}
      </div>
      {/* (Quicksale MVP): Hide price modification */}
      {/* <div className={classes.couponButton}>
        <CouponCodeForm
          disabled={disableCoupon}
          loading={loading}
          onSubmit={addCoupon}
        />
      </div> */}
    </div>
  );
};

export default React.memo(QuicksaleBasketPriceRecap);
