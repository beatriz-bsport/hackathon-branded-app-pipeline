import React from 'react';

import { withRouter, Switch, Redirect, Route } from 'react-router-dom';

import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { withTranslation } from 'react-i18next';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';
import { RootState } from '../../reducers';
import { parseQueryString } from '../../http';
import { fetchCompanyTheme } from '#libs/theme/actions';
// @ts-expect-error
import { disconnect } from '../../actions/auth.actions';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
// import themeSelectors, { getThemeLoading } from '#libs/theme/selectors';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

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
// @ts-expect-error
import LanguageButton from '../../components/button/LanguageButton.component';
// @ts-expect-error
import namespaces from '../../i18n/namespaces.json';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import './LoginRouterStyles.css';
import { isLoginBackgroundFixed } from './utils';
import withThemeProvider from '#hocs/company-themifier.hoc';

/* Some of these pages were reworked to be CSS Only, some were not. Here is which ones and why:

Login, ResetPassword and Signup pages were reworked because they appear on the booking flow on the member side.
Since the new booking flow can appear in the widget, it was necessary turning these pages into CSS Only
to allow customization in the widget.

Signout page was not reworked because it doesn't have CSS.

ValidateEmailWithToken, DoubleLogin, CompanyOnboardingRouter and AccountConfigurationRouter were not reworked
because they do not appear on the booking flow on the member side.

ChangePassword page was not reworked although it can be accessed on the member side because it is only accessible by clicking
a link on the email sent after reset password request, so it never appears in the widget.
*/

// @ts-expect-error
const Signout = asyncComponent(() => import('./Signout.page'));

const ValidateEmailWithTokenPage = asyncComponent(
  // @ts-expect-error
  () => import('./ValidateEmailWithToken.page'),
);

const LoginPage = asyncComponent(() => import('./login-page/Login.page'));

const ResetPassword = asyncComponent(
  // @ts-expect-error
  () => import('./reset-password-page/ResetPassword.page'),
);

const ChangePassword = asyncComponent(() => import('./ChangePassword.page'));
// @ts-expect-error
const DoubleLogin = asyncComponent(() => import('./DoubleLogin.page'));

const CompanyOnboardingRouter = asyncComponent(
  () => import('./company-onboarding/CompanyOnboarding.router'),
);
const AccountConfigurationRouter = asyncComponent(
  () => import('./account-configuration/AccountConfiguration.router'),
);

const SignupPage = asyncComponent(() => import('./signup-page/Signup.page'));

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
  simplifyUI?: boolean;
};

export class LoginRouter extends React.Component<Props> {
  componentDidMount() {
    window?.sessionStorage?.setItem(
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
      BsportRequestFromHeaderValue.SAAS_LOGIN_ROUTER,
    );
    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership);
    } else {
      this.props.fetchCompanyCustomSignUp({});
    }
    if (this.props.franchisor) {
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
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

  componentWillUnmount() {
    window?.sessionStorage?.removeItem(
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
    );
  }

  render() {
    const { location, franchiseTheme, simplifyUI } = this.props;
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
      <>
        {!simplifyUI && (
          <Hidden
            mdDown={location.pathname === '/login/signup'}
            xsDown={location.pathname !== '/login/signup'}
          >
            <LoginBackground
              backgroundFixed={isLoginBackgroundFixed(location.pathname)}
              company={!!this.props.membership}
              franchise={!!this.props.franchisor}
            />
            <Fade in>
              <div className="bs-container__header">
                <img
                  alt={alt}
                  className="bs-container__header__logo"
                  src={src}
                />

                <LanguageButton />
              </div>
            </Fade>
          </Hidden>
        )}
        <div className="bs-container">
          <Switch>
            <Route
              component={AccountConfigurationRouter}
              path="/login/accountConfiguration"
            />
            <Route component={Signout} path="/login/signout" />
            <Route component={ResetPassword} path="/login/reset_password" />
            <Route component={LoginPage} path="/login/customer" />
            <Route
              component={CompanyOnboardingRouter}
              path="/login/company_onboarding/:activeStep/"
            />
            <Route
              component={() => (
                <Redirect to="/login/company_onboarding/welcome" />
              )}
              path="/login/company_onboarding"
            />
            <Route
              component={ValidateEmailWithTokenPage}
              path="/login/email_validation/:uid/:token"
            />
            <Route
              component={ChangePassword}
              path="/login/change_password/:uid/:token"
            />
            <Route component={DoubleLogin} path="/login/double-login" />
            <Route component={SignupPage} path="/login/signup" />
            <Route component={LoginPage} path="/login" />
          </Switch>
        </div>
      </>
    );
  }
}

export default compose<any, Props>(
  withRouter,
  withTranslation(namespaces),
  withProps((props: Props) => ({
    // @ts-expect-error
    membership: parseQueryString(props.location.search).membership,
    // @ts-expect-error
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
      simplifyUI: !!membership && getIsUISimplified(state),
      // membershipThemeLoading: !!membership && getThemeLoading(state),
    }),
    {
      fetchCompanyTheme,
      disconnect,
      fetchCompanyCustomSignUp,
      fetchFranchiseTheme,
    },
  ),
  withThemeProvider,
  marketplaceCssHoc(),
)(LoginRouter);
