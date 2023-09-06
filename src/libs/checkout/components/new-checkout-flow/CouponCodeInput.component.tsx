import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { OptionCallBackWithKeyedCallbacks } from '../../../../state/types';
import TextFieldWithCustomColors from '#components/input/text-field/TextFieldWithCustomColors.component';
import { CouponErrorCodes } from '#libs/coupon/constants';
import { Coupon } from '#libs/coupon/types';

enum ErrorType {
  COUPON_NOT_APPLICABLE = 'not_applicable',
  ON_SEVERAL_ITEMS = CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS,
  EMPTY = '',
}

type CouponCodeInputProps = {
  onSubmit: (
    code: string,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  isBasketModificationDisabled: boolean;
};

const CouponCodeInput: React.FC<CouponCodeInputProps> = ({
  onSubmit,
  isBasketModificationDisabled,
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

  return (
    <div
      className={classNames(classes.couponInputContainer, {
        [classes.couponInputContainerError]: error !== ErrorType.EMPTY,
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
        error={error !== ErrorType.EMPTY}
        helperText={
          error !== ErrorType.EMPTY ? t(`code.addCoupon.${error}`) : null
        }
        label={t('code.addCoupon.label')}
        name="coupon_code-input"
        onChange={handleCouponCodeChange}
        placeholder={t('code.addCoupon.label')}
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
  },
  couponInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.grey[100],
    [theme.breakpoints.down('sm')]: {
      padding: ` ${theme.spacing(2)}px 0 ${theme.spacing(2)}px 0`,
      boxSizing: 'content-box',
      borderWidth: '0px',
    },
  },
  couponInputContainerError: {
    alignItems: 'baseline',
  },
  textField: { flex: 1 },
}));

export default React.memo(CouponCodeInput);
