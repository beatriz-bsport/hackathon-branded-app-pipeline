import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
// import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { fabShowLogin, fabShowProfile } from '../actions/modal';
import { getEnv } from '../utils/env';
import { RootState } from '../reducers';

// const MarketplaceShopStyled = themify(MarketplaceShopBase);

type OwnProps = {
  fabShowLogin: () => void,
  fabShowProfile: () => void,
  authenticated: boolean,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps;

class LoginButton extends Component<Props> {
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
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={this.onClick}
      >
        <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
        {this.props.t('navigation:backofficeMenu.consumer.myAccount')}
      </Button>
    );
  }
}
const mapStateToProps = (state: RootState) => ({
  authenticated: state.widget.saas.authenticated,
  username: state.widget.saas.username,
});

const mapDispatchToProps = {
  fabShowLogin,
  fabShowProfile,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['navigation']),
)(LoginButton);
