import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  BackendRestoredBanner,
  NetworkErrorBanner,
  NetworkRestoredBanner,
  ServerErrorBanner,
} from './BannerTemplate';
import { NetworkState } from '#src/libs/network/types';

export const Banner: React.FC<{
  networkState: NetworkState;
}> = ({ networkState }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.visible}>
        <NetworkErrorBanner isOpened={networkState === NetworkState.OFFLINE} />
        <ServerErrorBanner
          isOpened={networkState === NetworkState.SERVER_ERROR}
        />
        <NetworkRestoredBanner
          isOpened={networkState === NetworkState.NETWORK_RESTORED}
        />
        <BackendRestoredBanner
          isOpened={networkState === NetworkState.SERVER_RESTORED}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    zIndex: 999999,
    position: 'fixed',
    visibility: 'hidden',
    width: '100vw',
    height: '100vh',
  },
  visible: {
    visibility: 'visible',
  },
}));

export default React.memo(Banner);
