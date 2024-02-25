// @ts-nocheck
import React, { Component } from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';

import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import type { Dispatch } from '../../../state/types';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
import { parseQueryString } from '../../../http';
import { requestLogin, disconnect } from '../../../actions/auth.actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
import Analytics from '#components/analytics/Analytics.component';
import Login from '#csscomponents/Login/Login.component';
import { withQueryParamsUndecoded } from '#hocs/with-query-params.hoc';
import type { RootState } from '../../../reducers';
import { WithHandlerType } from '../../../utils/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#libs/franchise/components/FranchiseCompanyLogin.component';
import { FranchiseDetails } from '#libs/franchise/types';
import { fetchFranchiseTheme } from '#libs/franchise/actions';
import {
  getFranchiseThemeLoading,
  getFranchisor,
} from '#libs/franchise/selectors';
import { STEPS } from '#libs/login/utils';
import { buildSignUpUrl } from '../utils';
import './LoginPageStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#libs/exportable-components/actions';
import WithCustomCssProvider from '#hocs/company-custom-css.hoc';

type OwnProps = {
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
  queryParams: {
    step: string;
  };
  step: number;
  setQueryParams: (queryParam: string) => (value: string) => void;
  membership: string;
  franchisorId?: number;
  franchisor: FranchiseDetails;
  selectedFranchisee: number;
  setSelectedFranchisee: (id: number) => void;
  goToCompanyMemberProfilePage: (id: number) => void;
  goNext: string;
  paymentPackTemplateCompanies: string;
  context: string;
  signUpNext: string;
  simplifyUI?: boolean;
};

type ConnectedPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  ConnectedProps<typeof connector>;

type Props = OwnProps &
  ConnectedPropsType &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class ConsumerLoginPage extends Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      if (this.props.theme?.id) Analytics.signinShow();
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.retrieveCompanyCssConfiguration(
        parseInt(this.props.membership, 10),
      );
    }
    if (this.props.franchisor) {
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.theme && this.props.theme?.id) Analytics.signupShow();
  }

  onRequestSignup = () => {
    if (this.props.franchisorId) {
      return this.props.setQueryParams('step')(STEPS.franchiseeSelection);
    }

    return this.props.replace(`/login/signup${window.location.search}`);
  };

  render() {
    const {
      authenticated,
      t,
      theme,
      membership,
      franchisor,
      franchisorId,
      step,
      goToSignup,
      goNext,
      paymentPackTemplateCompanies,
      simplifyUI,
    } = this.props;

    if (authenticated) {
      if (goNext) {
        return <Redirect to={goNext} />;
      }

      return (
        <Redirect to={`/${membership ? `?membership=${membership}` : ''}`} />
      );
    }

    if (franchisorId && !this.props.franchisor) {
      return null;
    }

    let companiesSelectable = this.props.franchisor.companies;

    const companyList = paymentPackTemplateCompanies
      ?.split(',')
      ?.map((company) => parseInt(company));

    if (companyList?.length) {
      companiesSelectable = companiesSelectable?.filter((comp) =>
        paymentPackTemplateCompanies.includes(comp?.id),
      );
    }

    let containerClass = WidgetUtils.isWidget()
      ? 'bs-login-container--widget'
      : 'bs-login-container--webpage';

    if (simplifyUI) {
      containerClass += '--simplifyUI';
    }

    return (
      <div
        className={
          simplifyUI ? 'bs-flex-column--simplifyUI' : 'bs-flex-column--default'
        }
      >
        <div className={containerClass}>
          {(!franchisorId ||
            (franchisorId && step === STEPS.loginToFranchise)) && (
            <Login
              company={!!membership}
              doEmailLogin={this.props.doEmailLogin}
              error={this.props.errorLogin}
              errorFields={this.props.errorFields}
              franchisor={franchisor}
              isPremium={this.props.is_premium}
              loading={this.props.loginProcessing}
              originalLoginNextLink={goNext}
              requestSignUp={this.onRequestSignup}
              simplifyUI={simplifyUI}
              t={t}
              theme={theme}
            />
          )}

          {franchisor && step === STEPS.franchiseeSelection && (
            <FranchiseCompanyLogin
              authenticated={authenticated}
              companies={companiesSelectable}
              disconnect={this.props.disconnect}
              franchiseTheme={this.props.franchisor}
              franchisor={this.props.franchisorId}
              goToSignup={goToSignup}
              selectedFranchisee={this.props.selectedFranchisee}
              setSelectedFranchisee={this.props.setSelectedFranchisee}
              setStep={this.props.setQueryParams('step')}
            />
          )}

          {((!!theme && membership) || franchisor) && (
            <Analytics theme={theme} username="" />
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch, props: OwnProps) {
  const search = ((props && props.location) || {}).search || '';
  const opts = {
    goNext: ({ is_franchisor }: { is_franchisor: boolean }) => {
      if (!is_franchisor) {
        const { next, franchisor } = parseQueryString(search);

        if (next) {
          dispatch(push(next));
          return;
        }

        if (franchisor) {
          dispatch(push(`/c/franchisee-selector/${franchisor}`));
        }
      }
    },
    company: parseQueryString(search).membership,
    franchise: parseQueryString(search).franchisor,
  };
  return {
    doEmailLogin({ email, password }: { email: string; password: string }) {
      dispatch(
        requestLogin(email, password, {
          ...(opts || {}),
          onDone: () => Analytics.signinSuccess({ email }),
        }),
      );
    },
  };
}

const properMapDispatchToProps = {
  fetchCompanyTheme,
  fetchFranchiseTheme,
  disconnect,
  pushRouter: push,
  goToCompanyMemberProfilePage: (companyId: number) => push(`c/${companyId}`),
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
};

const mapWithHandlers = {
  goToSignup:
    ({
      signUpNext,
      context,
      pushRouter,
      location,
    }: OwnProps & ConnectedPropsType) =>
    (membership: string) => {
      pushRouter(buildSignUpUrl(signUpNext, context, membership, location));
    },
};

const mapStateToProps = (
  state: RootState,
  { membership, franchisorId }: { membership: string; franchisorId: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  authenticated: state.auth.authenticated,
  errorLogin: state.auth.error,
  loginProcessing: state.auth.loading,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
  is_premium: state.theme.theme.is_premium,
  franchisor: !!franchisorId && getFranchisor(state),
  franchiseThemeLoading: !!franchisorId && getFranchiseThemeLoading(state),
  simplifyUI: !!membership && getIsUISimplified(state),
  // membershipThemeLoading: !!membership && getThemeLoading(state),
  customConfiguration: state.exportableComponents.customCss,
});

const connector = connect(null, properMapDispatchToProps);

export default compose(
  withRouter,
  withTranslation('login'),
  withQueryParamsUndecoded([['step'], 'queryParams', 'setQueryParams']),
  withState('selectedFranchisee', 'setSelectedFranchisee', null),
  withProps((props: OwnProps) => {
    const {
      membership,
      franchisor,
      next,
      context,
      paymentPackTemplateCompanies,
      signUpNext,
    } = parseQueryString(props.location?.search || '');
    const step = parseInt(props.queryParams.step) || STEPS.loginToFranchise;

    return {
      membership,
      franchisorId: franchisor ? parseInt(franchisor, 10) : null,
      goNext: next,
      context,
      paymentPackTemplateCompanies,
      signUpNext,
      step,
    };
  }),
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerLoginPage);
