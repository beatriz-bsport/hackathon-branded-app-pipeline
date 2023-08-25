import React, { useCallback } from 'react';
import {
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Trans, useTranslation } from 'react-i18next';
import { ReferralTimeLimitUnits } from '#libs/referral/constants';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  showConditions: boolean;
  setShowConditions: (showConditions: boolean) => void;
  maxReferralUses: number;
  referredReduction: string;
  minBasketAmount: string;
  applicationTimeLimitIntervals: number;
  applicationTimeLimitUnit: ReferralTimeLimitUnits;
  referringReward: string;
  hideReferredReduction: boolean;
  hideReferringReward: boolean;
};

const MemberMarketplaceReferralPanelDialog: React.FC<Props> = ({
  showConditions,
  setShowConditions,
  maxReferralUses,
  referredReduction,
  minBasketAmount,
  applicationTimeLimitIntervals,
  applicationTimeLimitUnit,
  referringReward,
  hideReferredReduction,
  hideReferringReward,
}) => {
  const { t } = useTranslation('referral');
  const classes = useStyles();

  const handleCloseConditionsDialog = useCallback(
    () => setShowConditions(false),
    [setShowConditions],
  );

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={handleCloseConditionsDialog}
      open={!!showConditions}
    >
      <DialogTitle>
        <Typography variant="h6">{t('conditions.title')}</Typography>
        <IconButton
          className={classes.cancelIcon}
          onClick={handleCloseConditionsDialog}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography>
          <Trans i18nKey="conditions.description.maxUses" t={t}>
            Each member has a referral link
            <strong>
              The referring reward can be won {{ maxReferralUses }} times
            </strong>
          </Trans>
        </Typography>
        <Typography className={classes.bulletList}>
          {hideReferredReduction ? (
            <Trans i18nKey="conditions.description.signUp.noReduction" t={t}>
              The referred member can sign up and must make their first basket
              according to the following conditions:
              <ul>
                <li>
                  minimum basket amount{' '}
                  {{
                    minBasketAmount:
                      getCurrencyDisplayWithPrice(minBasketAmount),
                  }}
                </li>
                <li>
                  application time limit{' '}
                  {{
                    applicationTimeLimitIntervals,
                    applicationTimeLimitUnit: t(
                      `conditions.description.applicationTimeLimit.units.${applicationTimeLimitUnit}`,
                      { count: applicationTimeLimitIntervals },
                    ),
                  }}
                </li>
              </ul>
            </Trans>
          ) : (
            <Trans i18nKey="conditions.description.signUp.reduction" t={t}>
              The referred member can sign up
              <strong>
                and receive a reduction of {{ referredReduction }}
              </strong>
              if the following conditions are met:
              <ul>
                <li>
                  minimum basket amount{' '}
                  {{
                    minBasketAmount:
                      getCurrencyDisplayWithPrice(minBasketAmount),
                  }}
                </li>
                <li>
                  application time limit{' '}
                  {{
                    applicationTimeLimitIntervals,
                    applicationTimeLimitUnit: t(
                      `conditions.description.applicationTimeLimit.units.${applicationTimeLimitUnit}`,
                      { count: applicationTimeLimitIntervals },
                    ),
                  }}
                </li>
              </ul>
            </Trans>
          )}
        </Typography>
        {!hideReferringReward && (
          <div>
            <Typography>
              <Trans i18nKey="conditions.description.reward1" t={t}>
                If the first basket meets the conditions,
                <strong>
                  {' '}
                  a referring reward of{' '}
                  {{
                    referringReward:
                      getCurrencyDisplayWithPrice(referringReward),
                  }}{' '}
                </strong>
                can be obtained {{ maxReferralUses }} times
              </Trans>
            </Typography>
            <Typography>{t('conditions.description.reward2')}</Typography>
          </div>
        )}
        <Typography className={classes.italic}>
          {t('conditions.description.warning')}
        </Typography>
      </DialogContent>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  cancelIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(3),
  },
  bulletList: {
    '& > * > li': {
      listStyleType: 'disc',
    },
  },
  italic: {
    fontStyle: 'italic',
  },
}));

export default React.memo(MemberMarketplaceReferralPanelDialog);
