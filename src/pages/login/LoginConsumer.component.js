// @flow

import React, { Component } from 'react';

import { withStyles, Grid, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import parse from '../../query-string';

import { auth as authActions } from '../../actions';
import { ConsumerModalContainer, ConsumerLogin } from '../../components';
import SignUpForm from '../../components/form/SignUpForm.component';

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
  t: TFunction,
  classes: Object,
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
    const membership = parse(this.props.location.search) || 0;
    if (membership) {
      data.membership = membership;
    }
    /* eslint-disable */
    const r = await api.auth.signup(data);
    if (r) {
      switch (r.status) {
        case 201: {
          this.props.doEmailLogin({
            email: data.email,
            password: data.password,
          });
          return;
        }
        case 200: {
          alert(r.data.message);
          return;
        }
      }
    }
    alert(
      "Impossible de créer votre compte pour le moment, veuillez réessayer d'ici quelques minutes",
    );
  };

  render() {
    const {
      authenticated,
      errorLogin,
      loginProcessing,
      doEmailLogin,
      classes,
      t,
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
          <div className={classes.container}>
            <ConsumerLogin
              doEmailLogin={doEmailLogin}
              error={errorLogin}
              loading={loginProcessing}
              requestSignUp={this.switchToSignUp}
            />
          </div>
        </ConsumerModalContainer>
      );
    }

    return (
      <ConsumerModalContainer>
        <Grid
          container
          direction="column"
          spacing={32}
          className={classes.container}
        >
          <Grid item>
            <Typography variant="h2">{t('form.signUpTitle')}</Typography>
          </Grid>
          <Grid item>
            <SignUpForm
              loading={loginProcessing}
              onComplete={this.signUp}
              onCancel={this.cancelSignUp}
            />
          </Grid>
        </Grid>
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

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(translate()(ConsumerLoginPage)),
);
