import React, { useEffect, useState } from 'react';
import { Portal, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { MaterialStyleType } from '@bsport/saas-legacy/src/utils/types';
import { snackbarSuccess } from '@bsport/saas-legacy/src/actions/snackbar.actions';

import { handleBridgeMessage as handleBridgeMessageAction } from './actions';
import { getEnv } from '../../utils/env';

type OwnProps = {
  companyId: number;
  companyName: string;
  isBackofficePreview?: boolean;
  consumerSpaceContext: string | null;
};

type Props = OwnProps &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;
const CHECKING_OTHER_EXISTENCE = 'check';
const HAS_FOUND_OTHER = 'other_exist';
const IS_MASTER = 'master';

const PROXY_BRIDGE_ID = '@bsport-proxy-bridge-iframe';

const WidgetBridge = (props: Props) => {
  const { companyId, companyName, classes, handleBridgeMessage } = props;
  const [currentState, setCurrentState] = useState(CHECKING_OTHER_EXISTENCE);

  useEffect(() => {
    if (window?.widgetMasterTaken) {
      setCurrentState(HAS_FOUND_OTHER);
    } else {
      setCurrentState(IS_MASTER);
      window.widgetMasterTaken = true;
    }
  }, []);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.data && event.data.type) {
        handleBridgeMessage(event.data);
      }
    };
    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  const { WIDGET_PROXY_BRIDGE_URL } = getEnv();
  const proxyUri = `${WIDGET_PROXY_BRIDGE_URL}`;
  const key = `${companyId}-${companyName}`;
  const proxyKey = `proxy-${key}`;

  if (currentState !== IS_MASTER) {
    return <span />;
  }

  return (
    <Portal container={document.body}>
      <iframe
        key={proxyKey}
        className={classes.container}
        id={PROXY_BRIDGE_ID}
        src={proxyUri}
        title="bsport-proxy-bridge"
      />
    </Portal>
  );
};

const styles = () => ({
  container: {
    height: 1,
    width: 1,
    display: 'none !important',
  },
});

const mapDispatchToProps = {
  snackbarSuccess: (s: string) => snackbarSuccess(s),
  handleBridgeMessage: handleBridgeMessageAction,
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(null, mapDispatchToProps),
)(WidgetBridge);
