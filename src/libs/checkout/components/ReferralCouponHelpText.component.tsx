import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AlertIcon from '@material-ui/icons/ErrorOutline';
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
    <div className={classes.container}>
      <AlertIcon className={classes.errorIcon} />
      <Typography className={classes.errorText} variant="body2">
        {displayedText}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    alignSelf: 'stretch',
  },
  errorIcon: {
    color: '#F44336',
  },
  errorText: {
    color: '#621B16',
    whiteSpace: 'pre-line',
  },
}));

export default React.memo(ReferralCouponHelpText);
