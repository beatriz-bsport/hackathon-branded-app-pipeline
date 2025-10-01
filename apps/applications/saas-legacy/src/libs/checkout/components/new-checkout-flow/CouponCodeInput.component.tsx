import React from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import TextFieldWithCustomColors from '#src/components/input/text-field/TextFieldWithCustomColors.component';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import { Coupon } from '#src/libs/coupon/types';
import { OptionCallBackWithKeyedCallbacks } from '../../../../state/types';

enum ErrorType {
  COUPON_NOT_APPLICABLE = 'not_applicable',
  ON_SEVERAL_ITEMS = CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS,
  GIFTCARD_INVALID_ACTIVATION_DATE = CouponErrorCodes.GIFTCARD_INVALID_ACTIVATION_DATE,
  GIFTCARD_EXCEPTION = CouponErrorCodes.GIFTCARD_EXCEPTION,
  EMPTY = '',
}

type CouponCodeInputProps = {
  onSubmit: (
    code: string,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  isBasketModificationDisabled: boolean;
  isOnlyCouponCodeAccepted?: boolean;
};

/**
 * Coupon code input - A text field to insert either a valid promo code or giftcard
 * @param onSubmit The action to perform once applying the code
 * @param isBasketModificationDisabled If true, disables the submit button
 * @param isOnlyCouponCodeAccepted If true, only accepts coupon codes and not printable giftcard codes
 */
const CouponCodeInput: React.FC<CouponCodeInputProps> = ({
  onSubmit,
  isBasketModificationDisabled,
  isOnlyCouponCodeAccepted,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [couponCode, setCouponCode] = React.useState('');
  const [couponProcessing, setCouponProcessing] = React.useState(false);
  const [error, setError] = React.useState<ErrorType>(ErrorType.EMPTY);
  const { t } = useTranslation('coupon');

  const handleCouponCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCouponCode(event.target.value);
    },
    [],
  );

  const handleClearCouponCode = React.useCallback(() => {
    setCouponCode('');
    setError(ErrorType.EMPTY);
  }, []);

  const handleApplyCouponCode = React.useCallback(() => {
    setCouponProcessing(true);
    setError(ErrorType.EMPTY);
    onSubmit(couponCode, {
      onSuccess: () => {
        setCouponProcessing(false);
        setError(ErrorType.EMPTY);
        setCouponCode('');
      },
      onError: () => {
        setCouponProcessing(false);
        setError(ErrorType.COUPON_NOT_APPLICABLE);
      },
      [CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS]:
        () => {
          setCouponProcessing(false);
          setError(ErrorType.ON_SEVERAL_ITEMS);
        },
      [CouponErrorCodes.GIFTCARD_EXCEPTION]: () => {
        setCouponProcessing(false);
        setError(ErrorType.GIFTCARD_EXCEPTION);
      },
      [CouponErrorCodes.GIFTCARD_INVALID_ACTIVATION_DATE]: () => {
        setCouponProcessing(false);
        setError(ErrorType.GIFTCARD_INVALID_ACTIVATION_DATE);
      },
    });
  }, [couponCode, onSubmit]);

  const colorsOverride = React.useMemo(
    () => ({
      borderColor: theme.palette.grey[100],
      borderColorFocus: theme.palette.grey[100],
      borderColorHover: theme.palette.grey[100],
      placeholderColor: theme.palette.grey[600],
      labelColor: theme.palette.grey[600],
      labelColorFocus: theme.palette.grey[600],
    }),
    [theme.palette.grey],
  );

  const couponCodeFormLabel = isOnlyCouponCodeAccepted
    ? t('code.addCoupon.couponOnlyLabel')
    : t('code.addCoupon.label');

  return (
    <div
      className={clsx(classes.couponInputContainer, {
        [classes.couponInputContainerError]: !!error,
      })}
    >
      <TextFieldWithCustomColors
        className={classes.textField}
        colorsOverride={colorsOverride}
        endAdornment={
          couponCode && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearCouponCode}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }
        error={!!error}
        helperText={error ? t(`code.addCoupon.${error}`) : null}
        label={couponCodeFormLabel}
        name="coupon_code-input"
        onChange={handleCouponCodeChange}
        placeholder={couponCodeFormLabel}
        value={couponCode}
        variant="outlined"
      />
      <Button
        className={classes.applyButton}
        disabled={
          !couponCode || isBasketModificationDisabled || couponProcessing
        }
        onClick={handleApplyCouponCode}
      >
        {t('code.addCoupon.submit')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  applyButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: '6px 16px',
    borderRadius: '24px',
    background: theme.palette.primary.main,
    '&:disabled': {
      backgroundColor: theme.palette.grey[100],
    },
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    textTransform: 'none',
  },
  couponInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      padding: ` ${theme.spacing(2)}px 0 ${theme.spacing(2)}px 0`,
      boxSizing: 'content-box',
    },
  },
  couponInputContainerError: {
    alignItems: 'baseline',
  },
  textField: { flex: 1 },
}));

export default React.memo(CouponCodeInput);
