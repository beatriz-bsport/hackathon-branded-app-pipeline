// @flow
import React from 'react';

import { withRouter, Switch, Redirect, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RootState } from '../../reducers';
import { parseQueryString } from '../../http';
import { fetchCompanyTheme } from '#libs/theme/actions';
import { disconnect } from '../../actions/auth.actions';
import themeSelectors from '#libs/theme/selectors';
// import themeSelectors, { getThemeLoading } from '#libs/theme/selectors';
import asyncComponent from '../../AsyncComponent';

import { getTheme, getFranchiseTheme } from '../../theme';
import { fetchFranchiseTheme } from '#libs/franchise/actions';

import { fetchCompanyCustomSignUp } from '#libs/custom-form/actions';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import LoadingBackoffice from '#components/navigation/LoadingBackoffice.component';
import LoginBackground from '#libs/login/components/LoginBackground.component';
import {
  getFranchisor,
  getFranchiseThemeLoading,
} from '#libs/franchise/selectors';
import { FranchiseDetails } from '#libs/franchise/types';

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
  franchisor: string;
  company: string;
  fetchCompanyTheme: (membership: string) => void;
  classes: any;
  theme: CompanyTheme;
  loginProcessing: boolean;
  disconnect: () => void;
  fetchCompanyCustomSignUp: (params: { company?: string | number }) => void;
  fetchFranchiseTheme: (id: number) => void;
  franchiseTheme: FranchiseDetails;
  franchiseThemeLoading?: boolean;
  membershipThemeLoading?: boolean;
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
    } else if (this.props.franchisor) {
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
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

    if (
      this.props.franchisor !== prevProps.franchisor &&
      this.props.franchisor
    ) {
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
    }
  }

  componentWillMount() {
    if (this.props.loginProcessing) {
      this.props.disconnect();
    }
  }

  render() {
    const { classes, location, franchiseTheme } = this.props;
    let src: string = 'https://cdn.bsport.io/bsport_logo_txt.png';
    let alt: string = 'bsport-logo';
    if (this.props.theme) {
      src = this.props.theme.cover;
      alt = `${this.props.company} - logo`;
    }
    if (this.props.franchisor && franchiseTheme) {
      src = franchiseTheme.cover;
      alt = `${franchiseTheme.name} - logo`;
    }
    if (
      (this.props.franchisor && !this.props.franchiseTheme) ||
      (this.props.membership && !this.props.theme?.id)
    ) {
      return <LoadingBackoffice />;
    }

    return (
      <MuiThemeProvider
        theme={
          this.props.franchisor && franchiseTheme
            ? getFranchiseTheme(franchiseTheme)
            : getTheme(this.props.theme)
        }
      >
        <Hidden
          xsDown={location.pathname !== '/login/signup'}
          mdDown={location.pathname === '/login/signup'}
        >
          <LoginBackground
            company={!!this.props.membership}
            franchise={!!this.props.franchisor}
            theme={
              this.props.franchisor && franchiseTheme
                ? getFranchiseTheme(franchiseTheme)
                : getTheme(this.props.theme)
            }
          />
          <Fade in>
            <div>
              <img src={src} className={classes.logo} alt={alt} />
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
    zIndex: 2,
  },
  logo: {
    position: 'absolute',
    left: '6%',
    top: '6%',
    height: 50,
    zIndex: 9,
  },
  circularProgress: {
    position: 'fixed',
    top: '40%',
    left: '50%',
  },
});

export default compose<any, Props>(
  withRouter,
  withStyles(styles),
  withProps((props: Props) => ({
    membership: parseQueryString(props.location.search).membership,
    franchisor: parseQueryString(props.location.search).franchisor,
  })),
  connect(
    (
      state: RootState,
      { membership, franchisor }: { membership: string; franchisor: string },
    ) => ({
      theme: !!membership && themeSelectors.getTheme(state),
      loginProcessing: state.auth.loading,
      company: state.theme.theme.company_name,
      franchiseTheme: !!franchisor && getFranchisor(state),
      franchiseThemeLoading: !!franchisor && getFranchiseThemeLoading(state),
      // membershipThemeLoading: !!membership && getThemeLoading(state),
    }),
    {
      fetchCompanyTheme,
      disconnect,
      fetchCompanyCustomSignUp,
      fetchFranchiseTheme,
    },
  ),
)(LoginRouter);
