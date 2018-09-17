// @flow

import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from '../../query-string';

import { auth as authActions } from '../../actions';
import { ConsumerModalContainer, ConsumerLogin } from '../../components';

type Props = {
  authenticated: boolean,
  errorLogin: boolean,
  loginProcessing: boolean,
  doEmailLogin: ({
    email: string,
    password: string,
  }) => void,
  location: Object,
};

export class ConsumerLoginPage extends Component<Props> {
  render() {
    const {
      authenticated,
      errorLogin,
      loginProcessing,
      doEmailLogin,
    } = this.props;

    if (authenticated) {
      const { next } = parse(this.props.location.search);
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }

    return (
      <ConsumerModalContainer>
        <ConsumerLogin
          doEmailLogin={doEmailLogin}
          error={errorLogin}
          loading={loginProcessing}
        />
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorLogin: state.auth.error,
    loginProcessing: state.auth.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doEmailLogin({ email, password }) {
      dispatch(authActions.requestLogin(email, password));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerLoginPage);
