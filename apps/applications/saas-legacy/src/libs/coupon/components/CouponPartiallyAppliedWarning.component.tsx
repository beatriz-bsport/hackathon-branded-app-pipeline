import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';

const CouponPartiallyAppliedWarning: React.FC<{}> = () => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  return (
    <Alert className={classes.alert} severity="warning">
      {t('couponNotFullyAppliedWarning')}
    </Alert>
  );
};

const useStyles = makeStyles({
  alert: {
    alignItems: 'center',
    width: '100%',
  },
});

export default React.memo(CouponPartiallyAppliedWarning);
