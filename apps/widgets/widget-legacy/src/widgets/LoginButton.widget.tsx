import React, { Component } from 'react';
import { connect } from 'react-redux';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
// import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';

import { getEnv } from '../utils/env';
import { RootState } from '../reducers';
import {
  bridgeRequestAuthenticationStatus,
  bridgeRequestLogout as bridgeRequestLogoutAction,
} from '../libs/bridge/actions';
import { closeUserInteractionPortal as closeUserInteractionPortalAction } from '../libs/modal/actions';
import { buildUrlParams } from '../utils/http';

import type { MarketplaceLoginButtonWidgetConfig } from '@bsport/saas-legacy/src/libs/exportable-components/types';
import { ConsumerSpaceContextEnum } from '@bsport/saas-legacy/src/libs/consumer-space/constants';
import WidgetUtils from '@bsport/saas-legacy/src/libs/widget/WidgetUtils';

// const MarketplaceShopStyled = themify(MarketplaceShopBase);

type OwnProps = {
  onWindowOpen: (url: string) => void;
  companyId: number;
  franchiseId: number;
  uniqueWidgetId: string;
  config?: MarketplaceLoginButtonWidgetConfig;
};

type Props = OwnProps &
  WithTranslation &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

class LoginButton extends Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
    window?.addEventListener('message', this.handleOpenViaPostMessage);
    WidgetUtils.setConsumerSpaceContext(ConsumerSpaceContextEnum.LOGIN_BUTTON);
  }

  componentDidUpdate(prevProps: Props) {
    /**
     * Here we want to hide the member profile modal
     * only when the value of openMemberProfile is explicitely set to false
     */
    if (
      this.props.config?.openMemberProfile === false &&
      prevProps.authenticated !== this.props.authenticated &&
      !!this.props.authenticated
    ) {
      this.props.closeUserInteractionPortal();
    }
  }

  componentWillUnmount() {
    window?.removeEventListener('message', this.handleOpenViaPostMessage);
  }

  handleOpenViaPostMessage = (event: MessageEvent) => {
    if (
      event?.data?.type === 'bsport:login-button:request-login' &&
      event?.data?.data?.uniqueWidgetId === this.props.uniqueWidgetId
    ) {
      this.onClick();
    }
  };

  openUrl = (url: string) => {
    const { PUBLIC_URL } = getEnv();
    const urlFqdn = `${PUBLIC_URL}/${url}`;
    this.props.onWindowOpen(urlFqdn);
  };

  onClick = () => {
    if (this.props.authenticated) {
      if (this.props.franchiseId) {
        this.openUrl(`c/franchisee-selector/${this.props.franchiseId}/`);
      } else {
        this.openUrl(
          `c/${this.props.companyId}/booking/${buildUrlParams({
            consumerspacecontext: ConsumerSpaceContextEnum.LOGIN_BUTTON,
          })}`,
        );
      }
    } else if (this.props.franchiseId) {
      this.openUrl(
        `login?${buildUrlParams({
          franchisor: this.props.franchiseId,
        })}`,
      );
    } else {
      this.openUrl(
        `login${buildUrlParams({
          membership: this.props.companyId,
          next: `/c/${this.props.companyId}/booking/`,
          consumerspacecontext: ConsumerSpaceContextEnum.LOGIN_BUTTON,
        })}`,
      );
    }
  };

  render() {
    return (
      <ButtonGroup
        variant="outlined"
        color="primary"
        size="small"
        id="bsport-widget-authentication__button_group"
      >
        <Button
          onClick={this.onClick}
          id="bsport-widget-authentication__login_button"
        >
          <PersonIcon
            fontSize="small"
            style={{ marginRight: 8 }}
            id="bsport-widget-authentication__login_icon"
          />
          {this.props.authenticated
            ? this.props.t('logout')
            : this.props.t('login')}
        </Button>
        {this.props.authenticated && (
          <Button
            onClick={this.props.bridgeRequestLogout}
            size="small"
            id="bsport-widget-authentication__logout_button"
          >
            <PowerSettingsNewIcon
              fontSize="small"
              id="bsport-widget-authentication__logout_icon"
            />
          </Button>
        )}
      </ButtonGroup>
    );
  }
}
const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
  username: state.auth.username,
});

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus,
  bridgeRequestLogout: bridgeRequestLogoutAction,
  closeUserInteractionPortal: closeUserInteractionPortalAction,
};

export default compose<Props, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['navigation']),
)(LoginButton);
