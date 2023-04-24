// @ts-nocheck
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

type Props = {
  onSubmit: (
    code: string,
    options: {
      onSuccess?: () => void;
      onError?: (error?: Error) => void;
      onNotFound?: () => void;
    },
  ) => void;
  code: string;
  loading?: boolean;
  disabled?: boolean;
};

enum ERRORTYPE {
  COUPON_NOT_APPLICABLE = 'not_applicable',
  COUPON_NOT_FOUND = 'not_found',
  EMPTY = '',
}
export const CouponCodeForm: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('coupon');

  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ERRORTYPE>(ERRORTYPE.EMPTY);

  const onSubmit = () => {
    setLoading(true);
    setError(ERRORTYPE.EMPTY);
    props.onSubmit(code, {
      onSuccess: () => {
        setOpen(false);
        setLoading(false);
        setError(ERRORTYPE.EMPTY);
        setCode('');
      },
      onError: () => {
        setLoading(false);
        setError(ERRORTYPE.COUPON_NOT_APPLICABLE);
      },
      onNotFound: () => {
        setLoading(false);
        setError(ERRORTYPE.COUPON_NOT_FOUND);
      },
    });
  };

  const onCancel = () => {
    setOpen(false);
    setLoading(false);
    setError(ERRORTYPE.EMPTY);
  };

  return (
    <div className={classes.container}>
      <Button
        disabled={props.loading || props.disabled}
        onClick={() => setOpen(true)}
        color="primary"
      >
        {t('code.addCoupon.label')}
      </Button>
      <Dialog open={open}>
        <DialogContent>
          <TextField
            onChange={(ev) => setCode(ev.target.value)}
            value={props.code}
            variant="outlined"
            placeholder={t('code.addCoupon.placeholder')}
            label={t('code.addCoupon.label')}
          />
        </DialogContent>
        {error && (
          <Typography color="error" className={classes.marginLeft}>
            {t(`code.addCoupon.${error}`)}
          </Typography>
        )}
        <DialogActions>
          <Button onClick={onCancel}>{t('code.addCoupon.cancel')}</Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button color="primary" onClick={onSubmit}>
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
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
}));

export default CouponCodeForm;
