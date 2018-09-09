// @flow

import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import qs from 'query-string';

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
      const { next } = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      });
      if (next) {
        return <Redirect push to={next} />;
      }
      return <Redirect push to="/" />;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsumerLoginPage);
