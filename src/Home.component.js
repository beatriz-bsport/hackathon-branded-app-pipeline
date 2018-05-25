import React, { Component } from 'react';

import { connect } from 'react-redux';

import Login from './pages/Login.component';
import AuthenticatedHome from './pages/AuthenticatedHome.component';

export class Home extends Component<{}> {
  render() {
    const { authenticated } = this.props;
    return authenticated ? <AuthenticatedHome /> : <Login />;
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(Home);
