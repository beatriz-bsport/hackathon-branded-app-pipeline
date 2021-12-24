// @flow
import React from 'react';

import { withRouter, Switch, Redirect, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

import { withProps, compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { RootState } from '../../reducers';
import { parseQueryString } from '../../http';
import { fetchCompanyTheme } from '#libs/theme/actions';
import { disconnect } from '../../actions/auth.actions';
import themeSelectors from '#libs/theme/selectors';
import asyncComponent from '../../AsyncComponent';

import { getTheme } from '../../theme';

import { fetchCompanyCustomSignUp } from '#libs/custom-form/actions';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import LoginBackground from '#libs/login/components/LoginBackground.component';

const Signout = asyncComponent(() => import('./Signout.page'));

const ValidateEmailWithTokenPage = asyncComponent(
  () => import('./ValidateEmailWithToken.page'),
);

const LoginPage = asyncComponent(() => import('./Login.page'));

const ResetPassword = asyncComponent(() => import('./ResetPassword.page'));

const ChangePassword = asyncComponent(() => import('./ChangePassword.page'));

const DoubleLogin = asyncComponent(() => import('./DoubleLogin.page'));

const CompanyOnboardingRouter = asyncComponent(
  () => import('./company-onboarding/CompanyOnboarding.router'),
);

const SignupPage = asyncComponent(() => import('./Signup.page'));

type Props = {
  membership: string;
  company: string;
  fetchCompanyTheme: (membership: string) => void;
  classes: any;
  theme: CompanyTheme;
  loginProcessing: boolean;
  disconnect: () => void;
  fetchCompanyCustomSignUp: (params: { company?: string | number }) => void;
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
};

export class LoginRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership);
    } else {
      this.props.fetchCompanyCustomSignUp({});
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.membership !== prevProps.membership &&
      this.props.membership
    ) {
      this.props.fetchCompanyTheme(this.props.membership);
      this.props.fetchCompanyCustomSignUp({ company: this.props.membership });
    }
  }

  componentWillMount() {
    if (this.props.loginProcessing) {
      this.props.disconnect();
    }
  }

  render() {
    const { classes, location } = this.props;
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Hidden
          xsDown={location.pathname !== '/login/signup'}
          mdDown={location.pathname === '/login/signup'}
        >
          <LoginBackground company={!!this.props.membership} />
          <Fade in>
            <div>
              <img
                src={
                  this.props.theme
                    ? this.props.theme.cover
                    : 'https://cdn.bsport.io/bsport_logo_txt.png'
                }
                className={classes.logo}
                alt={
                  this.props.theme
                    ? `${this.props.company} - logo`
                    : 'bsport-logo'
                }
              />
            </div>
          </Fade>
        </Hidden>
        <div className={classes.loginContainer}>
          <Switch>
            <Route path="/login/signout" component={Signout} />
            <Route path="/login/reset_password" component={ResetPassword} />
            <Route path="/login/customer" component={LoginPage} />
            <Route
              path="/login/company_onboarding/:activeStep/"
              component={CompanyOnboardingRouter}
            />
            <Route
              path="/login/company_onboarding"
              component={() => (
                <Redirect to="/login/company_onboarding/welcome" />
              )}
            />
            <Route
              path="/login/email_validation/:uid/:token"
              component={ValidateEmailWithTokenPage}
            />
            <Route
              path="/login/change_password/:uid/:token"
              component={ChangePassword}
            />
            <Route path="/login/double-login" component={DoubleLogin} />
            <Route path="/login/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (): any => ({
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'absolute',
    zIndex: 2,
  },
  logo: {
    position: 'absolute',
    left: '6%',
    top: '6%',
    height: 50,
    zIndex: 9,
  },
});

export default compose<any, Props>(
  withRouter,
  withStyles(styles),
  withProps((props: Props) => ({
    membership: parseQueryString(props.location.search).membership,
  })),
  withState('step', 'setStep', 0),
  connect(
    (state: RootState, { membership }) => ({
      theme: !!membership && themeSelectors.getTheme(state),
      loginProcessing: state.auth.loading,
      company: state.theme.theme.company_name,
    }),
    {
      fetchCompanyTheme,
      disconnect,
      fetchCompanyCustomSignUp,
    },
  ),
)(LoginRouter);
