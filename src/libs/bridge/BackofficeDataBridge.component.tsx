import React from 'react';
import { Portal, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';

import {
  setSaasAuthenticated,
  setSaasBasketCount,
  setSaasBookingsCount,
} from '../../actions/widget';
import { closeUserInteractionPortal } from '../modal/actions';
import { handleBridgeMessage } from './actions';
import { getEnv } from '../../utils/env';

type OwnProps = {
  companyId: number,
  companyName: string,
};

type Props = OwnProps &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;
const CHECKING_OTHER_EXISTENCE = 'check';
const HAS_FOUND_OTHER = 'other_exist';
const IS_MASTER = 'master';

class WidgetBridge extends React.PureComponent<Props> {
  state = {
    currentState: CHECKING_OTHER_EXISTENCE,
  };

  componentWillMount() {
    const bridgeId = '@bsport-bridge-iframe';
    const existingBridge = document.getElementById(bridgeId);
    if (existingBridge) {
      this.setState({ currentState: HAS_FOUND_OTHER });
    } else {
      this.setState({
        currentState: IS_MASTER,
      });
    }
  }

  componentDidMount() {
    window.addEventListener(
      'message',
      (event: any) => {
        if (event.data && event.data.type) {
          this.props.handleBridgeMessage(event.data);
        }
      },
      false,
    );
  }

  render() {
    const { companyId, companyName } = this.props;
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/widget/${companyName}/${companyId}/bridge?context=widget`;
    const key = `${companyId}-${companyName}`;

    if (this.state.currentState !== IS_MASTER) {
      return <span />;
    }

    const bridgeId = '@bsport-bridge-iframe';

    return (
      <Portal container={document.body}>
        <iframe
          className={this.props.classes.container}
          id={bridgeId}
          title="bsport-bridge"
          key={key}
          src={url}
        />
      </Portal>
    );
  }
}

const styles = () => ({
  container: {
    height: 1,
    width: 1,
    display: 'none !important',
  },
});

const mapDispatchToProps = {
  setSaasAuthenticated,
  setSaasBasketCount,
  setSaasBookingsCount,
  closeUserInteractionPortal,
  snackbarSuccess: (s: string) => snackbarSuccess(s),
  handleBridgeMessage,
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(null, mapDispatchToProps),
)(WidgetBridge);
