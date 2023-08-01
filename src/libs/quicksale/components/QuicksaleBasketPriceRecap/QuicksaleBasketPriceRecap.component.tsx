import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Create from '@material-ui/icons/Create';
import Input from '@material-ui/core/Input';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '#libs/theme/selectors';
import CouponCodeForm from '#libs/coupon/components/CouponCodeForm.component';
import type { PaymentGroup } from '#libs/payment/types';
import type { Basket } from '#libs/checkout/types';

import type { OptionCallback } from '../../../../state/types';
import useStyles from './styles';

type Props = {
  basketTotalPrice?: number;
  modifiedPrice?: number;
  setModifiedPrice?: (
    price: number,
    options?: OptionCallback<PaymentGroup>,
  ) => void;
  partialPayment?: number;
  loading?: boolean;
  attachCoupon: (code: string, options?: OptionCallback<Basket>) => void;
  preventPriceModification?: boolean;
  internalAccount?: number;
};

const QuicksaleBasketPriceRecap: React.FC<Props> = ({
  basketTotalPrice,
  modifiedPrice,
  setModifiedPrice,
  partialPayment,
  loading,
  attachCoupon,
  preventPriceModification,
  internalAccount,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  const basketTotalPriceWithReductions =
    basketTotalPrice - (partialPayment ?? 0) - (internalAccount ?? 0);

  const [isEditingPrice, setIsEditingPrice] = React.useState(false);

  const startEditingPrice = React.useCallback(() => {
    setIsEditingPrice(true);
  }, []);

  const [newPrice, setNewPrice] = React.useState(0);

  const onPriceChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPrice(Number(e.target.value));
    },
    [setNewPrice],
  );

  const saveNewPrice = React.useCallback(() => {
    const priceToSet = Number(newPrice.toFixed(2));
    if (
      priceToSet <= 0 ||
      priceToSet > basketTotalPrice - (partialPayment ?? 0)
    ) {
      if (modifiedPrice !== basketTotalPriceWithReductions)
        setModifiedPrice(basketTotalPriceWithReductions);
    } else if (modifiedPrice !== priceToSet) setModifiedPrice(priceToSet);
    setIsEditingPrice(false);
    setNewPrice(0);
  }, [
    newPrice,
    basketTotalPrice,
    partialPayment,
    modifiedPrice,
    setModifiedPrice,
    basketTotalPriceWithReductions,
  ]);

  const cancelNewPrice = React.useCallback(() => {
    setNewPrice(0);
    if (modifiedPrice !== basketTotalPriceWithReductions)
      setModifiedPrice(basketTotalPriceWithReductions);
    setIsEditingPrice(false);
  }, [basketTotalPriceWithReductions, modifiedPrice, setModifiedPrice]);

  const addCoupon = React.useCallback(
    (code: string, options?: OptionCallback) => {
      attachCoupon(code, {
        onSuccess: (newBasket) => {
          if (modifiedPrice !== basketTotalPriceWithReductions)
            setModifiedPrice(
              newBasket.total_price_cts / 100 - (partialPayment ?? 0),
            );
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },
    [
      attachCoupon,
      basketTotalPriceWithReductions,
      modifiedPrice,
      partialPayment,
      setModifiedPrice,
    ],
  );

  if (!basketTotalPrice) return <></>;

  return (
    <div className={classes.container}>
      <Typography className={classes.fontWeight500} variant="h6">
        {t('checkout.priceRecap')}
      </Typography>

      {!loading && basketTotalPriceWithReductions !== modifiedPrice && (
        <div className={classes.recapLine}>
          <Typography variant="caption">{t('checkout.amountDue')}</Typography>
          <div className={classes.line} />
          <Typography variant="caption">
            {getCurrencyDisplayWithPrice(basketTotalPriceWithReductions)}
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
              {getCurrencyDisplayWithPrice(basketTotalPriceWithReductions)}
            </Typography>
          </div>
        </>
      )}

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
              {getCurrencyDisplayWithPrice(modifiedPrice)}
            </Typography>
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
          </div>
        )}

        {!loading && modifiedPrice !== basketTotalPriceWithReductions && (
          <Typography variant="caption">
            {`${t('checkout.leftDue')} ${getCurrencyDisplayWithPrice(
              basketTotalPriceWithReductions - modifiedPrice,
            )}`}
          </Typography>
        )}
      </div>

      <div className={classes.couponButton}>
        <CouponCodeForm loading={loading} onSubmit={addCoupon} />
      </div>
    </div>
  );
};

export default React.memo(QuicksaleBasketPriceRecap);
