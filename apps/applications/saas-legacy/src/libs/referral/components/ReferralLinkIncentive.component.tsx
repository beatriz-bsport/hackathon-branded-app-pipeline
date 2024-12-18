import React, { useCallback, useState } from 'react';
import { ButtonBase, Typography, makeStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Gift02 } from '#src/components/untitledui';
import type { ReferralProgram } from '#src/libs/referral/types';
import ReferralMemberSumupDialog from './referral-member-sumup/ReferralMemberSumupDialog.component';
import { getReferredReduction } from '../utils';

type Props = {
  referralProgram: ReferralProgram;
  referralLink: string;
};

const ReferralLinkIncentive: React.FC<Props> = ({
  referralProgram,
  referralLink,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'referral']);
  const [showConditions, setShowConditions] = useState(false);

  const handleOpenConditionsDialog = useCallback(
    () => setShowConditions(true),
    [],
  );

  const {
    minimum_basket_amount,
    maximum_referral_uses,
    amount_off_referred,
    percent_off_referred,
    referred_voucher_type,
    application_time_limit_intervals,
    application_time_limit_unit,
    amount_reward_referring,
  } = referralProgram;

  const { referredReduction, hideReferredReduction } = getReferredReduction({
    referred_voucher_type,
    amount_off_referred,
    percent_off_referred,
  });

  const hideReferringReward = parseInt(amount_reward_referring) === 0;

  return (
    <div className={classes.incentiveLinkContainer}>
      <div className={classes.section}>
        <div className={classes.title}>
          <Gift02 />
          <Typography className={classes.boldText} variant="subtitle1">
            {t('referral:checkoutValidation.title')}
          </Typography>
        </div>
        <Typography variant="body2">
          {t('referral:checkoutValidation.explain')}
        </Typography>
      </div>
      <div className={classes.section}>
        <div className={classes.row}>
          <CopyToClipboard text={referralLink}>
            <ButtonBase className={classes.copyLinkButton}>
              <FileCopyIcon />
              <Typography className={classes.boldText} component="h2">
                {t('referral:memberInfo.copyLink')}
              </Typography>
            </ButtonBase>
          </CopyToClipboard>
        </div>
        <Typography color="textSecondary" component="div" variant="caption">
          <ButtonBase onClick={handleOpenConditionsDialog}>
            <Typography
              className={classes.conditionsLink}
              color="textSecondary"
              variant="caption"
            >
              {t('referral:memberInfo.seeConditions')}
            </Typography>
          </ButtonBase>
        </Typography>
      </div>
      <ReferralMemberSumupDialog
        applicationTimeLimitIntervals={application_time_limit_intervals}
        applicationTimeLimitUnit={application_time_limit_unit}
        hideReferredReduction={hideReferredReduction}
        hideReferringReward={hideReferringReward}
        maxReferralUses={maximum_referral_uses}
        minBasketAmount={minimum_basket_amount}
        referredReduction={referredReduction}
        referringReward={amount_reward_referring}
        setShowConditions={setShowConditions}
        showConditions={showConditions}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  incentiveLinkContainer: {
    borderRadius: '12px',
    border: `2px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    padding: theme.spacing(2, 4),
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    alignSelf: 'stretch',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    alignSelf: 'stretch',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  boldText: {
    fontWeight: 500,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    borderRadius: '44px',
    border: '1px solid',
  },
  copyLinkButton: {
    minWidth: '250px',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: 'uppercase',
  },
  conditionsLink: {
    textDecoration: 'underline',
  },
}));

export default React.memo(ReferralLinkIncentive);
