// @flow

import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from '../../query-string';

import { auth as authActions } from '../../actions';
import {
  ConsumerModalContainer,
  ConsumerLogin,
  ConsumerSignUp,
} from '../../components';

import api from '../../api';

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

const STEPS = {
  WELCOME: 0,
  SIGNIN: 1,
  SIGNUP: 2,
};

export class ConsumerLoginPage extends Component<Props> {
  state = {
    step: STEPS.WELCOME,
  };

  switchToSignUp = () => {
    this.setState({
      step: STEPS.SIGNUP,
    });
  };

  cancelSignUp = () => {
    this.setState({
      step: STEPS.WELCOME,
    });
  };

  signUp = async (data) => {
    const r = await api.auth.signup(data);
    if (r) {
      switch (r.status) {
        case 201: {
          return this.props.doEmailLogin({
            email: data.email,
            password: data.password,
          });
        }
        case 200: {
          alert(r.data.message);
          return;
        }
        default:
          alert(
            "Impossible de créer votre compte pour le moment, veuillez réessayer d'ici quelques minutes",
          );
      }
    }
  };

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

    const { step } = this.state;

    if (step === STEPS.WELCOME) {
      return (
        <ConsumerModalContainer>
          <ConsumerLogin
            doEmailLogin={doEmailLogin}
            error={errorLogin}
            loading={loginProcessing}
            requestSignUp={this.switchToSignUp}
          />
        </ConsumerModalContainer>
      );
    }

    return (
      <ConsumerModalContainer>
        <ConsumerSignUp
          loading={loginProcessing}
          onComplete={this.signUp}
          onCancel={this.cancelSignUp}
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
    signup(data) {
      dispatch(authActions.signup(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsumerLoginPage);
