import React, { useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { useBasketInstalmentPaymentOptionStyle } from '#src/libs/instalment-payment-configuration/hooks';
import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';
import {
  DAILY,
  MONTHLY,
  WEEKLY,
} from '#src/libs/instalment-payment-configuration/constants';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import InstalmentPaymentMultiplyIcon from './InstalmentPaymentConfigurationMultiplyIcon.component';
import { getFirstInstalmentAmount } from '../utils';

type Props = {
  checked: boolean;
  instalmentPayment: InstalmentPaymentApiWithBasketId;
  basketPrice: number;
  disabled: boolean;
  withPaddingLeft?: boolean;
  onSelect: (id?: number) => void;
  unselectable?: boolean;
};

export const BasketInstalmentPaymentOption: React.FC<Props> = ({
  checked,
  instalmentPayment,
  basketPrice,
  disabled,
  withPaddingLeft,
  onSelect,
  unselectable,
}) => {
  const isCheckoutContext = React.useContext(CheckoutContext);

  const { t } = useTranslation(['instalmentPayment']);
  const classes = useBasketInstalmentPaymentOptionStyle({
    checked,
    isCheckoutContext,
  });
  const { recurrency, frequency, number_of_billing, partial_payment_enabled } =
    instalmentPayment;

  const calculateInstallmentDate = useCallback(
    (quantityToAdd: number) => {
      switch (recurrency) {
        case DAILY:
          return DateTime.now().plus({ days: quantityToAdd });
        case WEEKLY:
          return DateTime.now().plus({ weeks: quantityToAdd });
        case MONTHLY:
          return DateTime.now().plus({ months: quantityToAdd });
        default: // YEARLY
          return DateTime.now().plus({ years: quantityToAdd });
      }
    },
    [recurrency],
  );

  const instalmentDateList = useMemo(() => {
    return new Array(number_of_billing)
      .fill(0)
      .map((item, index) =>
        calculateInstallmentDate(frequency * index).toLocaleString(
          DateTime.DATE_SHORT,
        ),
      );
  }, [frequency, calculateInstallmentDate, number_of_billing]);

  const firstInstalmentAmount = useMemo(
    () => getFirstInstalmentAmount(instalmentPayment, basketPrice),
    [instalmentPayment, basketPrice],
  );

  // Match backend: split remainder in cents, floor each payment, last gets remainder
  const instalmentAmountList = useMemo(() => {
    if (number_of_billing === 1) return [firstInstalmentAmount];

    const totalCts = Math.round(basketPrice * 100);
    const firstCts = Math.round(parseFloat(firstInstalmentAmount) * 100);
    const remainderCts = totalCts - firstCts;
    const nRemaining = number_of_billing - 1;
    const baseAmountCts = Math.floor(remainderCts / nRemaining);
    const lastAmountCts = remainderCts - baseAmountCts * (nRemaining - 1);

    const baseAmounts = Array(nRemaining - 1)
      .fill(null)
      .map(() => (baseAmountCts / 100).toFixed(2));

    return [
      firstInstalmentAmount,
      ...baseAmounts,
      (lastAmountCts / 100).toFixed(2),
    ];
  }, [basketPrice, firstInstalmentAmount, number_of_billing]);

  const handleChange = useCallback(() => {
    if (!checked && !!onSelect) {
      onSelect(instalmentPayment.id);
    }
  }, [checked, onSelect, instalmentPayment.id]);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Radio
          checked={checked}
          color="primary"
          disabled={disabled}
          onChange={handleChange}
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
              className={clsx({ [classes.disabledText]: unselectable })}
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
          className={clsx(classes.column, {
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
                <div key={date} className={classes.row}>
                  <Typography variant="caption">{date}</Typography>
                  <Typography color="textSecondary" variant="caption">
                    {`${t(':')} ${getCurrencyDisplayWithPrice(
                      instalmentAmountList[index],
                    )}`}
                  </Typography>
                </div>
              ))}
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(BasketInstalmentPaymentOption);
