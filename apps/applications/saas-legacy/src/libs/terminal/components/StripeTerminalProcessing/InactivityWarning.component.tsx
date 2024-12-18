import React, { useRef } from 'react';
import chroma from 'chroma-js';
import { DateTime } from 'luxon';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Countdown from '#src/components/time/CountDown.component';

const useStyles = makeStyles((theme) => {
  return {
    blueContainer: {
      backgroundColor: chroma(theme.palette.info.main).alpha(0.1).hex(),
      width: '100%',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      color: chroma(theme.palette.info.main).darken(2.6).hex(),
      borderRadius: theme.spacing(0.5),
    },
    countdownCircle: {
      height: 56,
      width: 56,
      borderRadius: '50%',
      backgroundColor: theme.palette.info.main,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    countdownText: {
      color: '#fff',
      fontWeight: 500,
    },
    title: {
      fontWeight: 500,
      padding: theme.spacing(1),
    },
  };
});

export type Props = {
  onFinish: () => void;
};

export const InactivityWarning: React.FC<Props> = ({ onFinish }) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const timestamp = useRef(DateTime.now().plus({ seconds: 30 }).toSeconds());

  return (
    <>
      <Countdown onFinish={onFinish} timestamp={timestamp.current}>
        {(countdown: string) => {
          return (
            <div className={classes.blueContainer}>
              <div className={classes.countdownCircle}>
                <Typography className={classes.countdownText}>
                  {countdown || '00:00'}
                </Typography>
              </div>

              <Typography className={classes.title} variant="subtitle1">
                {t(
                  'configuration.stripeTerminal.paymentDialog.processing.inactivity.title',
                )}
              </Typography>

              <Typography>
                {t(
                  'configuration.stripeTerminal.paymentDialog.processing.inactivity.content',
                )}
              </Typography>
            </div>
          );
        }}
      </Countdown>
    </>
  );
};

export default React.memo(InactivityWarning);
