import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type ReferralCouponHelpTextProps = {
  missingAmountBeforeApplication?: number;
  hasReachedMaxUses?: boolean;
};

export const ReferralCouponHelpText: React.FC<ReferralCouponHelpTextProps> = ({
  missingAmountBeforeApplication,
  hasReachedMaxUses,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('checkout');

  let displayedText;

  if (missingAmountBeforeApplication)
    displayedText = t('myBasket.referral.missingAmountBeforeApplication', {
      missingAmount: getCurrencyDisplayWithPrice(
        missingAmountBeforeApplication,
      ),
    });

  if (hasReachedMaxUses)
    displayedText = t('myBasket.referral.hasReachedMaxUses');

  return (
    <Alert className={classes.alert} severity="warning">
      {displayedText}
    </Alert>
  );
};

const useStyles = makeStyles(() => ({
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(ReferralCouponHelpText);
