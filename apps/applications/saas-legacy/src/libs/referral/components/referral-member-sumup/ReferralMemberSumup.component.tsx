import React, { useCallback, useState } from 'react';
import {
  ButtonBase,
  Divider,
  LinearProgress,
  Typography,
  alpha,
  makeStyles,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getReferredReduction } from '#src/libs/referral/utils';
import { ReferralProgram } from '#src/libs/referral/types';
import ReferralMemberSumupDialog from './ReferralMemberSumupDialog.component';

type Props = {
  nbRemainingReferralUses: number;
  referralProgram: ReferralProgram;
  referralLink: string;
  isLoading: boolean;
};

const ReferralMemberSumup: React.FC<Props> = ({
  nbRemainingReferralUses,
  referralProgram,
  referralLink,
  isLoading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'referral']);
  const [showConditions, setShowConditions] = useState(false);

  const handleOpenConditionsDialog = useCallback(
    () => setShowConditions(true),
    [],
  );

  if (isLoading || !referralProgram) {
    return (
      <>
        <Typography className={classes.title} component="h2" variant="h6">
          {t('referral:memberInfo.referralLink')}
        </Typography>
        <LinearProgress />
      </>
    );
  }

  if (nbRemainingReferralUses === 0) {
    return (
      <div>
        <Typography className={classes.title} component="h2" variant="h6">
          {t('referral:memberInfo.referralLink')}
        </Typography>
        <Divider />
        <Alert className={classes.warningMaxUsesReached} severity="warning">
          <Typography>
            {t('referral:memberInfo.warningMaxUsesReached')}
          </Typography>
        </Alert>
      </div>
    );
  }

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
    <div>
      <Typography className={classes.title} component="h2" variant="h6">
        {t('referral:memberInfo.referralLink')}
      </Typography>
      <Divider />
      <div className={classes.flexColumn}>
        <Typography>{t('referral:memberInfo.inviteFriend')}</Typography>
        <div className={classes.row}>
          {!hideReferringReward && (
            <div className={classes.column}>
              <Typography
                className={classes.centeredText}
                color="primary"
                variant="h6"
              >
                {getCurrencyDisplayWithPrice(amount_reward_referring)}
              </Typography>
              <Typography className={classes.centeredText}>
                {t('referral:memberInfo.forYou')}
              </Typography>
            </div>
          )}
          {!(hideReferredReduction || hideReferringReward) && (
            <div className={classes.plusIcon}>
              <AddIcon />
            </div>
          )}
          {!hideReferredReduction && (
            <div className={classes.column}>
              <Typography
                className={classes.centeredText}
                color="primary"
                variant="h6"
              >
                {`- ${referredReduction}`}
              </Typography>
              <Typography className={classes.centeredText}>
                {t('referral:memberInfo.forYourFriend')}
              </Typography>
            </div>
          )}
        </div>
        <div className={classes.row}>
          <CopyToClipboard text={referralLink}>
            <ButtonBase className={classes.copyLinkButton}>
              <Typography>{t('referral:memberInfo.copyLink')}</Typography>
              <FileCopyIcon />
            </ButtonBase>
          </CopyToClipboard>
        </div>
        <div className={classes.flexRow}>
          <Typography color="textSecondary" variant="caption">
            {`${t(
              'referral:memberInfo.nbRemainingUses',
            )} : ${nbRemainingReferralUses}/${maximum_referral_uses}`}
          </Typography>
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
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(1),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    gap: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  plusIcon: {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    maxHeight: theme.spacing(5),
  },
  centeredText: {
    textAlign: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(2),
    },
  },
  copyLinkButton: {
    minWidth: '250px',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  conditionsLink: {
    textDecoration: 'underline',
  },
  warningMaxUsesReached: {
    marginTop: theme.spacing(3),
  },
}));

export default React.memo(ReferralMemberSumup);
