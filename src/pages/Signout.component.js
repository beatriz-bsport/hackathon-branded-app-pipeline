import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { auth as authActions } from '../actions';

export function Signout(props) {
  props.disconnect();
  return <Redirect to="/" />;
}

function mapDispatchToProps(dispatch) {
  return {
    disconnect() {
      dispatch(authActions.disconnect());
    },
  };
}
export default connect(null, mapDispatchToProps)(Signout);
