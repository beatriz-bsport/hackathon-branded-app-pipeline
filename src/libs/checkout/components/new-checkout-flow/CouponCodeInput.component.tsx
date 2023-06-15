import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import TextFieldWithCustomColors from '#components/input/text-field/TextFieldWithCustomColors.component';

enum ERRORTYPE {
  COUPON_NOT_APPLICABLE = 'not_applicable',
  EMPTY = '',
}

type CouponCodeInputProps = {
  onSubmit: (
    code: string,
    options: {
      onSuccess?: () => void;
      onError?: (error?: Error) => void;
    },
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
  const [error, setError] = React.useState<ERRORTYPE>(ERRORTYPE.EMPTY);
  const { t } = useTranslation('coupon');

  const handleCouponCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCouponCode(event.target.value);
    },
    [],
  );

  const handleClearCouponCode = React.useCallback(() => {
    setCouponCode('');
    setError(ERRORTYPE.EMPTY);
  }, []);

  const handleApplyCouponCode = React.useCallback(() => {
    setCouponProcessing(true);
    setError(ERRORTYPE.EMPTY);
    onSubmit(couponCode, {
      onSuccess: () => {
        setCouponProcessing(false);
        setError(ERRORTYPE.EMPTY);
        setCouponCode('');
      },
      onError: () => {
        setCouponProcessing(false);
        setError(ERRORTYPE.COUPON_NOT_APPLICABLE);
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
    <div className={classes.couponInputContainer}>
      <TextFieldWithCustomColors
        name="coupon_code-input"
        label={t('code.addCoupon.label')}
        value={couponCode}
        onChange={handleCouponCodeChange}
        placeholder={t('code.addCoupon.label')}
        variant="outlined"
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleClearCouponCode}>
              {couponCode && <ClearIcon />}
            </IconButton>
          </InputAdornment>
        }
        colorsOverride={colorsOverride}
        error={error !== ERRORTYPE.EMPTY}
        helperText={
          error !== ERRORTYPE.EMPTY ? t(`code.addCoupon.${error}`) : null
        }
        className={classes.textField}
      />
      <Button
        disabled={
          !couponCode || isBasketModificationDisabled || couponProcessing
        }
        className={classes.applyButton}
        onClick={handleApplyCouponCode}
      >
        {couponProcessing ? (
          <CircularProgress
            style={{ marginRight: 8 }}
            size={24}
            color="inherit"
          />
        ) : (
          t('code.addCoupon.submit')
        )}
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
  },
  textField: { flex: 1 },
}));

export default React.memo(CouponCodeInput);
