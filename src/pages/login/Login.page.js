// @flow

import React, { Component } from 'react';
import { compose, withProps } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';

import { push } from 'connected-react-router';
import getCalendyLinkFromCountry from '../../i18n/utils/calendy-link-language';
import themeSelectors from '../../libs/theme/selectors';
import { parseQueryString } from '../../http';
import { openIntercomHelp } from '../../intercom';
import {
  signupV2 as signup,
  checkEmailExists,
  requestLogin,
} from '../../actions/auth.actions';

import { fetchCompanyTheme } from '../../libs/theme/actions';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import {
  getSignUpFormConfiguration,
  getSignUpFormConfigurationDict,
} from '../../libs/sign-up-form/selectors';

import Analytics from '../../components/analytics/Analytics.component';
import Login from '../../libs/login/components/Login.component';
import CustomSignUpForm from '../../libs/sign-up-form/components/CustomSignUpForm.component';

import type {
  SignUpFormConfig,
  signUpConfigDict,
} from '../../libs/sign-up-form/types';

type Props = {
  authenticated: boolean,
  errorLogin: boolean,
  errorFields: ?{ email: ?string, password: ?string },
  loginProcessing: boolean,
  doEmailLogin: ({
    email: string,
    password: string,
  }) => void,
  signup: (data: [*], formData: formData) => void,
  location: Object,
  t: TFunction,
  classes: Object,
  emailExists: boolean,
  checkEmailExistsLoading: boolean,
  checkEmailExists: (email: string) => void,
  membership: ?number,
  is_premium: boolean,

  fetchCompanyTheme: (companyId: number) => void,
  fetchSignFormUpConfiguration: ({ membership: ?string }) => void,
  theme: Theme,
  signUpConfig: SignUpFormConfig,
  signUpConfigDict: signUpConfigDict,
  signUpConfigLoading: boolean,
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
    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership);
    }
    this.props.fetchSignFormUpConfiguration({
      membership: this.props.membership,
    });
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

  signup = (formdata: *, options: OptionCallback) => {
    if (this.props.membership) {
      formdata.append('membership', this.props.membership);
    }
    this.props.signup(formdata, options);
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
      is_premium,
    } = this.props;

    if (authenticated) {
      const { next } = parseQueryString(this.props.location.search);
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }

    const { step } = this.state;

    if (step === STEPS.WELCOME) {
      return (
        <div className={classes.container}>
          <Login
            doEmailLogin={doEmailLogin}
            error={errorLogin}
            errorFields={errorFields}
            loading={loginProcessing}
            requestSignUp={this.switchToSignUp}
          />
          {!!this.props.theme && this.props.membership && (
            <Analytics username="" theme={this.props.theme} />
          )}
          {!is_premium && (
            <Hidden smDown>
              <a href={getCalendyLinkFromCountry()}>
                <Typography variant="caption">{t('contactUs')}</Typography>
              </a>
            </Hidden>
          )}
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h4">{t('signup.title')}</Typography>
            <IconButton onClick={() => openIntercomHelp('login')}>
              <HelpIcon />
            </IconButton>
          </div>
          {!this.props.signUpConfigLoading &&
            this.props.signUpConfig &&
            this.props.signUpConfig.poll_fields && (
              <CustomSignUpForm
                loading={loginProcessing}
                onComplete={this.signup}
                onCancel={this.cancelSignUp}
                theme={this.props.theme}
                emailExists={this.props.emailExists}
                checkEmailExistsLoading={this.props.checkEmailExistsLoading}
                checkEmailExists={this.props.checkEmailExists}
                signUpConfig={this.props.signUpConfig}
                signUpConfigDict={this.props.signUpConfigDict}
                waiver={this.props.theme.waiver}
                generalTermsAndConditions={
                  this.props.theme.general_terms_and_conditions
                }
              />
            )}
        </div>
        {!!this.props.theme && this.props.membership && (
          <Analytics username="" theme={this.props.theme} />
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, props) {
  const search = ((props && props.location) || {}).search || '';
  const opts = {
    goNext: ({ is_franchisor }) =>
      !is_franchisor ? push(parseQueryString(search).next) : null,
    company: parseQueryString(search).membership,
  };
  return {
    fetchCompanyTheme,
    fetchSignFormUpConfiguration,
    doEmailLogin({ email, password }) {
      dispatch(requestLogin(email, password, opts));
    },
    signup(formdata, options) {
      dispatch(
        checkEmailExists(formdata.get('email'), {
          onError: options && options.onError,
          onSuccess: () =>
            dispatch(
              signup(formdata, {
                membership: props.membership,
                goNext: props.goNext,
                onError: options && options.onError,
              }),
            ),
        }),
      );
    },
  };
}

const styles = (theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing(6),
    width: '100%',
    overflow: 'auto',
    height: '90vh',
    marginTop: '10vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['login']),
  withRouter,
  withProps((props) => ({
    membership: parseQueryString(props.location.search).membership,
    goNext: parseQueryString(props.location.search).next,
  })),
  connect(
    (state, { membership }) => ({
      theme: !!membership && themeSelectors.getTheme(state),
      authenticated: state.auth.authenticated,
      errorLogin: state.auth.error,
      loginProcessing: state.auth.loading,
      errorFields: state.auth.invalidFields,
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
      is_premium: state.theme.theme.is_premium,
      signUpConfig: getSignUpFormConfiguration(state),
      signUpConfigDict: getSignUpFormConfigurationDict(state),
      signUpConfigLoading: state.poll.signUpForm.loading,
    }),
    mapDispatchToProps,
  ),
)(ConsumerLoginPage);
