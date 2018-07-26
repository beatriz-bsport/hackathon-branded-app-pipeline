import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import { auth as authActions } from '../../actions';
import { colors } from 'bsport-commons/lib/colors';

export function DisconnectButton(props) {
  const { authenticated, t } = props;

  const renderDisconnectButton = () => {
    return (
      <Button onClick={props.disconnect}>
        <Typography color="error" variant="subheading">
          {t('navigation.logoff').toUpperCase()}
        </Typography>
      </Button>
    );
  };

  if (authenticated) {
    return renderDisconnectButton();
  }
  return null;
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    disconnect() {
      dispatch(authActions.disconnect());
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(DisconnectButton),
);
