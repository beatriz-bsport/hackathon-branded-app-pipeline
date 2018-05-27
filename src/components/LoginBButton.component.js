import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Button, Typography } from '@material-ui/core';

export function TopBar(props) {
  const { authenticated } = props;

  const renderDisconnectButton = () => {
    return (
      <Button onClick={props.disconnect} color="error">
        <Typography color="inherit">Disconnect</Typography>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
