import React from 'react';
import { Portal, withStyles } from '@material-ui/core';
import { WidgetMessageType } from 'bsport-saas/src/libs/widget/types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';

import {
  refreshVODRequestAccessFlagAction,
  closeUserInteractionPortal,
  setSaasAuthenticated,
  setSaasBasketCount,
  setSaasBookingsCount,
} from '../store/actions.widget';
import { RootState } from '../store/reducer';
import { getEnv } from '../utils/env';

type OwnProps = {
  companyId: number,
  companyName: string,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

class WidgetBridge extends React.PureComponent<Props> {
  componentDidMount() {
    window.addEventListener(
      'message',
      (event: any) => {
        const element = document.getElementById('@bsport-bridge-iframe');
        let iframe = null;
        // @ts-ignore
        if (element && element.contentWindow) {
          // @ts-ignore
          iframe = element.contentWindow;
        }

        if (event.data && event.data.type) {
          switch (event.data.type) {
            case WidgetMessageType.AUTHENTICATED_STATUS_READY:
              iframe &&
                iframe.postMessage(
                  { type: WidgetMessageType.GET_AUTHENTICATED_STATUS },
                  '*',
                );
              break;

            case WidgetMessageType.BASKET_COUNT_READY:
              iframe &&
                iframe.postMessage(
                  { type: WidgetMessageType.GET_BASKET_COUNT },
                  '*',
                );
              break;

            case WidgetMessageType.BOOKINGS_COUNT_READY:
              iframe &&
                iframe.postMessage(
                  { type: WidgetMessageType.GET_BOOKINGS_COUNT },
                  '*',
                );
              break;

            case WidgetMessageType.AUTHENTICATED_STATUS:
              this.props.setSaasAuthenticated(event.data.authenticated);
              if (!event.data.authenticated) {
                this.props.setSaasBookingsCount(null);
                this.props.setSaasBasketCount(null);
              }
              break;

            case WidgetMessageType.BASKET_COUNT:
              this.props.setSaasBasketCount(event.data.count);
              break;

            case WidgetMessageType.BOOKINGS_COUNT:
              this.props.setSaasBookingsCount(event.data.count);
              break;

            case WidgetMessageType.PAYMENT_SUCCESS:
              this.props.closeUserInteractionPortal();
              this.props.refreshVODRequestAccessFlagAction();
              this.props.snackbarSuccess('snackbar:consumerPass.success');
              break;

            case WidgetMessageType.LOGIN_SUCCESS:
              if (this.props.isFabContext) {
                this.props.closeUserInteractionPortal();
              }
              break;

            default:
              break;
          }
        }
      },
      false,
    );
  }

  static onLogout() {
    const element = document.getElementById('@bsport-bridge-iframe');
    let iframe = null;
    // @ts-ignore
    if (element && element.contentWindow) {
      // @ts-ignore
      iframe = element.contentWindow;
    }
    iframe && iframe.postMessage({ type: WidgetMessageType.LOGOUT }, '*');
  }

  render() {
    const { companyId, companyName } = this.props;
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/widget/${companyName}/${companyId}/bridge?context=widget`;
    const key = `${companyId}-${companyName}`;

    const bridgeId = '@bsport-bridge-iframe';

    const existingBridge = document.getElementById(bridgeId);

    if (existingBridge) {
      return <span />;
    }

    return (
      <Portal container={document.body}>
        <iframe
          id={bridgeId}
          title="bsport-bridge"
          key={key}
          src={url}
          className={this.props.classes.container}
        />
      </Portal>
    );
  }
}

const styles = () => ({
  container: {
    display: 'none !important',
  },
});

const mapStateToProps = (state: RootState) => ({
  isFabContext: state.widget.isFabContext,
});

const mapDispatchToProps = {
  setSaasAuthenticated,
  setSaasBasketCount,
  setSaasBookingsCount,
  closeUserInteractionPortal,
  refreshVODRequestAccessFlagAction,
  snackbarSuccess: (s: string) => snackbarSuccess(s),
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetBridge);
