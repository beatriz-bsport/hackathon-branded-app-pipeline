import React, { Component } from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';

import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect, type ConnectedProps } from 'react-redux';
import { withTranslation, type WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import Login from '#src/components/css-only/Login/Login.component';
// @ts-expect-error
import { withQueryParamsUndecoded } from '#src/hocs/with-query-params.hoc';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#src/libs/franchise/components/FranchiseCompanyLogin.component';
import type { FranchiseDetails } from '#src/libs/franchise/types';
import { fetchFranchiseTheme } from '#src/libs/franchise/actions';
import {
  getFranchiseThemeLoading,
  getFranchisor,
} from '#src/libs/franchise/selectors';
import { STEPS } from '#src/libs/login/utils';

import './LoginPageStyles.css';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { isBookingFlowNext } from '#src/libs/marketplace/routing-utils';
import { COMPANY_IDS_TO_DISPLAY_REGISTER_BOOKING_TITLE } from '#src/libs/sign-up-form/utils';
import type { RootState } from '#src/reducers';
import type { WithHandlerType } from '#src/utils/types';
import { buildSignUpUrl } from '../utils';
// @ts-expect-error
import { requestLogin, disconnect } from '#src/actions/auth.actions';
import { parseQueryString } from '#src/http';
import type { Dispatch } from '#src/state/types';
import analyticsUtils from '#src/components/analytics/analytics';
import {
  trackLoginEvent,
  trackLoginViewedEvent,
} from '#src/events/authentication/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

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

type RouterProps = {
  setQueryParams: (queryParam: string) => (value: string | number) => void;
  replace: (url: string) => void;
};

type Props = OwnProps &
  ConnectedPropsType &
  RouterProps &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class ConsumerLoginPage extends Component<Props> {
  componentDidMount() {
    analyticsClientB2C.track(trackLoginViewedEvent({}));
    if (this.props.membership) {
      if (this.props.theme?.id) {
        analyticsUtils.onShowSignin();
      }
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.retrieveCompanyCssConfiguration(
        parseInt(this.props.membership, 10),
      );
    }
    if (this.props.franchisor) {
      // @ts-expect-error
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.theme && this.props.theme?.id) {
      analyticsUtils.onShowSignin();
    }
  }

  onRequestSignup = () => {
    if (this.props.franchisorId) {
      return this.props.setQueryParams('step')(STEPS.franchiseeSelection);
    }

    return this.props.replace(`/login/signup${window.location.search}`);
  };

  onRequestResetPassword = (url: string) => {
    return this.props.replace(url);
  };

  render() {
    const {
      authenticated,
      theme,
      membership,
      franchisor,
      franchisorId,
      step,
      goToSignup,
      goNext,
      paymentPackTemplateCompanies,
      simplifyUI,
      context,
    } = this.props;

    const bookingFlowIsNext =
      isBookingFlowNext(goNext) &&
      COMPANY_IDS_TO_DISPLAY_REGISTER_BOOKING_TITLE.includes(
        parseInt(membership),
      );

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
      // @ts-expect-error
      companiesSelectable = companiesSelectable?.filter((comp) =>
        // @ts-expect-error
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
              bookingFlowIsNext={bookingFlowIsNext}
              company={!!membership}
              context={context}
              doEmailLogin={this.props.doEmailLogin}
              error={!!this.props.errorLogin}
              franchisor={franchisor}
              isPremium={this.props.is_premium}
              loading={this.props.loginProcessing}
              onRequestResetPassword={this.onRequestResetPassword}
              originalLoginNextLink={goNext}
              requestSignUp={this.onRequestSignup}
              simplifyUI={simplifyUI}
              theme={theme}
            />
          )}

          {franchisor && step === STEPS.franchiseeSelection && (
            <FranchiseCompanyLogin
              authenticated={authenticated}
              // @ts-expect-error
              companies={companiesSelectable}
              disconnect={this.props.disconnect}
              franchiseTheme={this.props.franchisor}
              franchisor={this.props.franchisorId}
              // @ts-expect-error
              goToSignup={goToSignup}
              selectedFranchisee={this.props.selectedFranchisee}
              setSelectedFranchisee={this.props.setSelectedFranchisee}
              setStep={this.props.setQueryParams('step')}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch, props: OwnProps) {
  const search = ((props && props.location) || {}).search || '';
  const opts = {
    onSuccess: ({
      is_franchisor,
      is_manager,
    }: {
      is_franchisor: boolean;
      is_manager: boolean;
    }) => {
      if (!is_manager && !is_franchisor) {
        analyticsClientB2C.track(trackLoginEvent({}));
      }
    },
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
  is_premium: state.theme.theme.is_premium,
  franchisor: !!franchisorId && getFranchisor(state),
  franchiseThemeLoading: !!franchisorId && getFranchiseThemeLoading(state),
  simplifyUI: !!membership,
  customConfiguration: state.exportableComponents.customCss,
});

/* eslint-disable-next-line */
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
  // @ts-expect-error
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerLoginPage);
