import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import moment from 'moment-timezone';
import classNames from 'classnames';
import type { InstalmentPaymentApiWithBasketId } from '../types';
import InstalmentPaymentMultiplyIcon from './InstalmentPaymentConfigurationMultiplyIcon.component';
import { DAILY, MONTHLY, WEEKLY } from '../constants';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { useBasketInstalmentPaymentOptionStyle } from '#libs/instalment-payment-configuration/hooks';
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';

type OwnProps = {
  checked: boolean;
  instalmentPayment: InstalmentPaymentApiWithBasketId;
  basketPrice: number;
  disabled: boolean;
  withPaddingLeft?: boolean;
  onSelect: (id?: number) => void;
  unselectable?: boolean;
};
type ShortandMoment = 'y' | 'd' | 'w' | 'M';
type Props = OwnProps;

export const BasketInstalmentPaymentOption: React.FC<Props> = ({
  checked,
  instalmentPayment,
  basketPrice,
  disabled,
  withPaddingLeft,
  onSelect,
  unselectable,
}) => {
  const isNewCheckoutFlow = React.useContext(CheckoutContext);

  const { t } = useTranslation(['instalmentPayment']);
  const classes = useBasketInstalmentPaymentOptionStyle({
    checked,
    isNewCheckoutFlow,
  });

  const {
    recurrency,
    frequency,
    number_of_billing,
    custom_first_instalment_amount,
    custom_first_instalment_enabled,
    custom_first_instalment_percent,
    custom_first_instalment_type,
    partial_payment_enabled,
  } = instalmentPayment;

  let shorthandRecurrency = 'y' as ShortandMoment;
  switch (recurrency) {
    case DAILY:
      shorthandRecurrency = 'd';
      break;
    case WEEKLY:
      shorthandRecurrency = 'w';
      break;
    case MONTHLY:
      shorthandRecurrency = 'M';
      break;

    default:
      break;
  }

  const instalmentDateList = useMemo(() => {
    return new Array(number_of_billing).fill(0).map((item, index) =>
      moment()
        .add(frequency * index, shorthandRecurrency)
        .format('L'),
    );
  }, [frequency, number_of_billing, shorthandRecurrency]);

  const firstInstalmentAmount = useMemo(() => {
    const hasCustomfirstPayment =
      custom_first_instalment_enabled || partial_payment_enabled;

    if (!hasCustomfirstPayment)
      return (basketPrice / number_of_billing).toFixed(2);
    if (custom_first_instalment_type === 0)
      return custom_first_instalment_amount.toFixed(2);
    return ((custom_first_instalment_percent / 100) * basketPrice).toFixed(2);
  }, [
    custom_first_instalment_amount,
    custom_first_instalment_enabled,
    custom_first_instalment_percent,
    custom_first_instalment_type,
    partial_payment_enabled,
    basketPrice,
    number_of_billing,
  ]);

  const otherInstalmentsAmount = useMemo(() => {
    if (number_of_billing === 1) return '0';
    return (
      Math.trunc(
        ((basketPrice - parseFloat(firstInstalmentAmount)) /
          (number_of_billing - 1)) *
          100,
      ) / 100
    ).toFixed(2);
  }, [number_of_billing, basketPrice, firstInstalmentAmount]);

  const lastInstalmentAmount = useMemo(() => {
    if (number_of_billing === 1) return '0';
    return (
      basketPrice -
      parseFloat(firstInstalmentAmount) -
      parseFloat(otherInstalmentsAmount) * (number_of_billing - 2)
    ).toFixed(2);
  }, [
    basketPrice,
    firstInstalmentAmount,
    otherInstalmentsAmount,
    number_of_billing,
  ]);

  const instalmentAmountList = new Array(number_of_billing)
    .fill(0)
    .map((item, index) => {
      switch (index) {
        case 0:
          return firstInstalmentAmount;
        case number_of_billing - 1:
          return lastInstalmentAmount;
        default:
          return otherInstalmentsAmount;
      }
    });

  const handleChange = useCallback(() => {
    if (!checked && !!onSelect) {
      onSelect(instalmentPayment.id);
    }
  }, [checked, onSelect, instalmentPayment.id]);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Radio
          disabled={disabled}
          onChange={handleChange}
          color="primary"
          checked={checked}
        />

        {partial_payment_enabled && (
          <Typography>
            {t('configurationOption.payLater', {
              amount: getCurrencyDisplayWithPrice(firstInstalmentAmount),
            })}
          </Typography>
        )}

        {!partial_payment_enabled && (
          <>
            <Typography
              className={classNames({ [classes.disabledText]: unselectable })}
            >
              {instalmentPayment.name}
            </Typography>
            <InstalmentPaymentMultiplyIcon
              multiplyFactor={number_of_billing}
              unselectable={unselectable}
            />
          </>
        )}
      </div>
      <Collapse in={checked}>
        <div
          className={classNames(classes.column, {
            [classes.paddingLeftMobile]: !!withPaddingLeft,
          })}
        >
          {partial_payment_enabled && (
            <Typography variant="caption">
              {t('configurationOption.payLaterRemainder', {
                remainder: getCurrencyDisplayWithPrice(
                  basketPrice - parseFloat(firstInstalmentAmount),
                ),
              })}
            </Typography>
          )}

          {!partial_payment_enabled && (
            <>
              {instalmentDateList.map((date, index) => (
                <div className={classes.row} key={date}>
                  <Typography variant="caption">{date}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {`${t(':')} ${getCurrencyDisplayWithPrice(
                      instalmentAmountList[index],
                    )}`}
                  </Typography>
                </div>
              ))}{' '}
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(BasketInstalmentPaymentOption);
