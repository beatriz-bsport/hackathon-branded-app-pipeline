// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, IconButton, Typography } from '@material-ui/core';
import TimeoutButton from '#components/button/TimeoutButton.component';
import IntercomIcon from '#components/icons/IntercomIcon.component';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type OwnProps = {
  goNext: () => void;
  cancel: () => void;
  contactSupport: () => void;
  dateAccountIsBlocked?: string;
};
type Props = OwnProps;
export const NeedStripeAccountConfiguration: React.FC<Props> = ({
  goNext,
  cancel,
  contactSupport,
  dateAccountIsBlocked,
}) => {
  const { t } = useTranslation(['login']);
  const classes = useStyles();
  const dateAccountIsBLockedFormattedLL = formatAsDatetimeAdapted(
    dateAccountIsBlocked,
    'LL',
  );
  return (
    <>
      <Typography variant="h5" className={classes.title}>
        {t('needStripe.stripeAccount')}
      </Typography>
      <Typography className={classes.content}>
        {dateAccountIsBlocked
          ? t('needStripe.infoDateBlocked', {
              dateAccountIsBLockedFormattedLL,
            })
          : t('needStripe.info')}
      </Typography>

      <div className={classes.actions}>
        <div className={classes.actionsStart}>
          {contactSupport && (
            <IconButton
              color="primary"
              className={classes.intercomButton}
              disableRipple
              id="intercomIcon"
              onClick={contactSupport}
            >
              <IntercomIcon className={classes.intercomIcon} />
            </IconButton>
          )}
        </div>
        <div className={classes.actionsEnd}>
          {cancel && (
            <TimeoutButton delayBeforeActivation={15} onClick={cancel}>
              {t('common:close')}
            </TimeoutButton>
          )}
          <Button onClick={goNext} color="primary" variant="contained">
            {t('accountConfiguration.configureMyStripeAccount')}
          </Button>
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  intercomButton: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  intercomIcon: { fill: 'white', width: '26px', height: '30px' },
  title: { padding: theme.spacing(4) },
  content: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(1),
  },
  actionsStart: {
    display: 'flex',
    alignItems: 'center',
    flex: '0',
  },
  actionsEnd: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));
export default NeedStripeAccountConfiguration;
