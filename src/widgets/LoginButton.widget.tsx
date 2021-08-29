import React, { Component } from 'react';
import { connect } from 'react-redux';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
// import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { getEnv } from '../utils/env';
import { RootState } from '../reducers';
import {
  bridgeRequestAuthenticationStatus,
  bridgeRequestLogout,
} from '../libs/bridge/actions';

// const MarketplaceShopStyled = themify(MarketplaceShopBase);

type OwnProps = {
  authenticated: boolean,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps;

class LoginButton extends Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
  }

  openUrl = (url: string) => {
    const { PUBLIC_URL } = getEnv();
    const urlFqdn = `${PUBLIC_URL}/${url}`;
    this.props.onWindowOpen(urlFqdn);
  };

  onClick = () => {
    if (this.props.authenticated) {
      this.openUrl(`c/${this.props.companyId}/profile`);
    } else {
      this.openUrl(`login?membership=${this.props.companyId}`);
    }
  };

  render() {
    return (
      <ButtonGroup variant="outlined" color="primary" size="small">
        <Button
          onClick={this.onClick}
          disabled={this.props.authenticationLoading}
        >
          <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
          {this.props.t('navigation:backofficeMenu.consumer.myAccount')}
        </Button>
        {this.props.authenticated && !this.props.authenticationLoading && (
          <Button onClick={this.props.bridgeRequestLogout} size="small">
            <PowerSettingsNewIcon fontSize="small" />
          </Button>
        )}
      </ButtonGroup>
    );
  }
}
const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  authenticationLoading: state.bridge.authentication.loading,
  username: state.bridge.authentication.username,
});

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus,
  bridgeRequestLogout,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['navigation']),
)(LoginButton);
