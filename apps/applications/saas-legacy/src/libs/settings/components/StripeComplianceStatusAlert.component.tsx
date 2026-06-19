import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import TimeoutButton from '#src/components/button/TimeoutButton.component';
import type { StripeCompanyComplianceStatus } from '#src/libs/company/types';
import { formatAsDatetimeAdapted } from '#src/utils/datetime';

type StripeComplianceStatusModalProps = {
  complianceStatus: StripeCompanyComplianceStatus;
  cancel?: () => void;
  goNext: () => void;
};

export const StripeComplianceStatusModal: React.FC<
  StripeComplianceStatusModalProps
> = ({ complianceStatus, cancel, goNext }) => {
  const { t } = useTranslation(['navigation', 'common']);
  const classes = useStyles();
  const translationStatus =
    complianceStatus.status === 'restricted' ? 'restricted' : 'restrictedSoon';
  const date = complianceStatus.restricted_on || complianceStatus.due_date;
  const formattedDate = date ? formatAsDatetimeAdapted(date, 'DDD') : null;
  const descriptionKey =
    translationStatus === 'restrictedSoon' && !formattedDate
      ? 'stripeCompliance.modal.restrictedSoon.descriptionWithoutDate'
      : `stripeCompliance.modal.${translationStatus}.description`;

  return (
    <>
      <Typography className={classes.title} variant="h5">
        {t(`stripeCompliance.modal.${translationStatus}.title`)}
      </Typography>
      <Typography className={classes.content}>
        {t(descriptionKey, { date: formattedDate })}
      </Typography>
      <Typography className={classes.content}>
        {t('stripeCompliance.modal.genericImpact')}
      </Typography>

      <div className={classes.actions}>
        {cancel && (
          <TimeoutButton delayBeforeActivation={15} onClick={cancel}>
            {t('common:close')}
          </TimeoutButton>
        )}
        <Button color="primary" onClick={goNext} variant="contained">
          {t(`stripeCompliance.cta.${complianceStatus.cta.kind}`)}
        </Button>
      </div>
    </>
  );
};

type StripeComplianceStatusBannerProps = {
  complianceStatus: StripeCompanyComplianceStatus;
  onClick: () => void;
};

export const StripeComplianceStatusBanner: React.FC<
  StripeComplianceStatusBannerProps
> = ({ complianceStatus, onClick }) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles();
  const formattedDate = complianceStatus.due_date
    ? formatAsDatetimeAdapted(complianceStatus.due_date, 'DDD')
    : null;

  return (
    <div className={classes.bannerContainer}>
      <ButtonBase className={classes.banner} onClick={onClick}>
        <div className={classes.bannerText}>
          <WarningIcon fontSize="small" />
          <Typography align="left" variant="caption">
            {t(
              formattedDate
                ? 'stripeCompliance.banner'
                : 'stripeCompliance.bannerWithoutDate',
              { date: formattedDate },
            )}
          </Typography>
        </div>
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  title: { padding: theme.spacing(4) },
  content: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
  },
  bannerContainer: {
    left: 0,
    right: 0,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    zIndex: 999,
  },
  banner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  bannerText: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
}));
