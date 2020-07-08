// @flow
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import { useTranslation } from 'react-i18next';
import { compose, withStateHandlers } from 'recompose';
import BroadcastRoom from '../../libs/video/components/BroadcastRoom.component';

type Props = {
  broadcastActivated: boolean,
  activateBroadcast: () => void,
  offer: Offer,
};

export const OfferBroadcastHelper = (props: Props) => {
  const { t } = useTranslation(['offer']);
  if (props.broadcastActivated) {
    return (
      <BroadcastRoom
        userType="coach"
        date_start={props.offer.date_start}
        duration_minute={props.offer.duration_minute}
        broadcast_info={props.offer.broadcast_info}
      />
    );
  }
  return (
    <ButtonBase
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 16,
        justifyContent: 'center',
        minHeight: 300,
        width: '100%',
        flexDirection: 'column',
      }}
      onClick={props.activateBroadcast}
    >
      <VideocamIcon style={{ height: '30vh', width: '30vh' }} />
      <Button variant="outlined" color="primary" style={{ marginBottom: 30 }}>
        {t('video.activateVideo')}
      </Button>
    </ButtonBase>
  );
};

export default compose(
  withStateHandlers(
    { broadcastActivated: false },
    {
      activateBroadcast: () => () => ({ broadcastActivated: true }),
    },
  ),
)(OfferBroadcastHelper);
