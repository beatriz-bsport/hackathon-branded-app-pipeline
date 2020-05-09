// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import parse from '../../query-string';
import { openIntercomHelp } from '../../intercom';

import { auth as authActions } from '../../actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import ConsumerLogin from '../../components/consumer/login/ConsumerLogin.component';
import SignUpForm from '../../components/form/SignUpForm.component';

type Props = {
  authenticated: boolean,
  errorLogin: boolean,
  errorFields: ?{ email: ?string, password: ?string },
  loginProcessing: boolean,
  doEmailLogin: ({
    email: string,
    password: string,
  }) => void,
  signup: (data: [*]) => void,
  location: Object,
  t: TFunction,
  classes: Object,
  emailExists: boolean,
  checkEmailExistsLoading: boolean,
  checkEmailExists: (email: string) => void,

  fetchCompanyTheme: (companyId: number) => void,
  theme: Theme,
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

  componentDidMount() {
    const { membership } = parse(this.props.location.search);
    if (membership) {
      this.props.fetchCompanyTheme(membership);
    }
  }

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

  signup = (data: *) => {
    const { membership } = parse(this.props.location.search);
    if (membership) {
      this.props.signup({ ...data, membership });
    } else {
      this.props.signup(data);
    }
  };

  render() {
    const {
      authenticated,
      errorLogin,
      errorFields,
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
        <Paper className={classes.container}>
          <ConsumerLogin
            doEmailLogin={doEmailLogin}
            error={errorLogin}
            errorFields={errorFields}
            loading={loginProcessing}
            requestSignUp={this.switchToSignUp}
          />
        </Paper>
      );
    }

    return (
      <Paper className={classes.container}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">{t('form.signUpTitle')}</Typography>
          <IconButton onClick={() => openIntercomHelp('login')}>
            <HelpIcon />
          </IconButton>
        </div>
        <SignUpForm
          loading={loginProcessing}
          onComplete={this.signup}
          onCancel={this.cancelSignUp}
          theme={this.props.theme}
          emailExists={this.props.emailExists}
          checkEmailExistsLoading={this.props.checkEmailExistsLoading}
          checkEmailExists={this.props.checkEmailExists}
          backToLogin={() => this.setState({ step: STEPS.WELCOME })}
        />
      </Paper>
    );
  }
}

function mapDispatchToProps(dispatch, props) {
  const search = ((props && props.location) || {}).search || '';
  const opts = { next: parse(search).next };
  return {
    fetchCompanyTheme,
    doEmailLogin({ email, password }) {
      dispatch(authActions.requestLogin(email, password, opts));
    },
    signup(data) {
      dispatch(authActions.signup(data, opts));
    },
    checkEmailExists(email) {
      dispatch(authActions.checkEmailExists(email));
    },
  };
}

const styles = (theme) => ({
  container: {
    margin: '50px auto',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withRouter,
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      errorLogin: state.auth.error,
      loginProcessing: state.auth.loading,
      errorFields: state.auth.invalidFields,
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
      theme: state.theme.theme,
    }),
    mapDispatchToProps,
  ),
)(ConsumerLoginPage);
