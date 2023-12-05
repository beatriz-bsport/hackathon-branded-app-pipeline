import React from 'react';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import { useTranslation } from 'react-i18next';
import { Paper, Typography, makeStyles } from '@material-ui/core';
// @ts-expect-error
import BroadcastRoom from '../../libs/video/components/BroadcastRoom.component';
import type { Offer } from '#libs/offer/types';

type Props = {
  offer: Offer;
};

export const OfferBroadcastHelper: React.FC<Props> = ({ offer }) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();

  const [broadcastActivated, setBroadcastActivated] = React.useState(false);

  const activateBroadcast = React.useCallback(() => {
    setBroadcastActivated(true);
  }, [setBroadcastActivated]);

  if (broadcastActivated) {
    return (
      <BroadcastRoom
        broadcast_info={offer.broadcast_info}
        date_start={offer.date_start}
        duration_minute={offer.duration_minute}
        userType="coach"
      />
    );
  }
  return (
    <Paper className={classes.root}>
      <div className={classes.container}>
        <div className={classes.iconContainer}>
          <VideocamIcon style={{ height: '48px', width: '48px' }} />
          <div className={classes.detailsContainer}>
            <Typography variant="body1">{t('video.livestream')}</Typography>
            <Typography variant="body2">{t('video.description')}</Typography>
          </div>
        </div>
        <Button color="primary" onClick={activateBroadcast} variant="outlined">
          {t('video.activateVideo')}
        </Button>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export default React.memo(OfferBroadcastHelper);
