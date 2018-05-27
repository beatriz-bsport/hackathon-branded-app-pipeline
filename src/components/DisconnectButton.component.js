import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';

import { auth as authActions } from '../actions';

export function DisconnectButton(props) {
  const { authenticated } = props;

  const renderDisconnectButton = () => {
    return (
      <Button onClick={props.disconnect} color="white">
        DISCONNECT
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
export default connect(mapStateToProps, mapDispatchToProps)(DisconnectButton);
