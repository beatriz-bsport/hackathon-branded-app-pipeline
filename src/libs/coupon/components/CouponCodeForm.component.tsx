import React from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import { CouponErrorCodes } from '../constants';

type Props = {
  onSubmit: (
    code: string,
    options: {
      onSuccess?: () => void;
      onError?: (error?: Error) => void;
      onNotFound?: () => void;
    } & { [errorCode: number]: () => void },
  ) => void;
  loading?: boolean;
  disabled?: boolean;
};

enum ErrorType {
  COUPON_NOT_APPLICABLE = 'not_applicable',
  COUPON_NOT_FOUND = 'not_found',
  ON_SEVERAL_ITEMS = CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS,
  LOCKED = CouponErrorCodes.UNIQUE_CODE_LOCKED,
  EMPTY = '',
}
export const CouponCodeForm: React.FC<Props> = ({
  onSubmit,
  loading,
  disabled,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('coupon');

  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [modalLoading, setModalLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorType>(ErrorType.EMPTY);

  const onCouponSubmit = () => {
    setModalLoading(true);
    setError(ErrorType.EMPTY);
    onSubmit(code, {
      onSuccess: () => {
        setOpen(false);
        setModalLoading(false);
        setError(ErrorType.EMPTY);
        setCode('');
      },
      [CouponErrorCodes.COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS]:
        () => {
          setModalLoading(false);
          setError(ErrorType.ON_SEVERAL_ITEMS);
        },
      [CouponErrorCodes.UNIQUE_CODE_LOCKED]: () => {
        setModalLoading(false);
        setError(ErrorType.LOCKED);
      },
      onError: () => {
        setModalLoading(false);
        setError(ErrorType.COUPON_NOT_APPLICABLE);
      },
      onNotFound: () => {
        setModalLoading(false);
        setError(ErrorType.COUPON_NOT_FOUND);
      },
    });
  };

  const onCancel = () => {
    setOpen(false);
    setModalLoading(false);
    setError(ErrorType.EMPTY);
  };

  return (
    <div className={classes.container}>
      <Button
        color="primary"
        disabled={loading || disabled}
        onClick={() => setOpen(true)}
      >
        {t('code.addCoupon.label')}
      </Button>
      <Dialog open={open}>
        <DialogContent>
          <TextField
            label={t('code.addCoupon.label')}
            onChange={(ev) => setCode(ev.target.value)}
            placeholder={t('code.addCoupon.placeholder')}
            value={code}
            variant="outlined"
          />
          {error && (
            <Typography className={classes.errorMessage} color="error">
              {t(`code.addCoupon.${error}`)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{t('code.addCoupon.cancel')}</Button>
          {modalLoading ? (
            <CircularProgress />
          ) : (
            <Button color="primary" onClick={onCouponSubmit}>
              {t('code.addCoupon.submit')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: theme.spacing(2),
    maxWidth: '220px',
  },
}));

export default React.memo(CouponCodeForm);
