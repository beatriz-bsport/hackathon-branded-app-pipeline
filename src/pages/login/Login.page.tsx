// @flow

import React, { Component } from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import type { Dispatch } from '../../state/types';
import themeSelectors from '#libs/theme/selectors';
import { parseQueryString } from '../../http';
import { requestLogin, disconnect } from '../../actions/auth.actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
import Analytics from '#components/analytics/Analytics.component';
import Login from '#libs/login/components/Login.component';
import { withQueryParamsUndecoded } from '../../hocs/with-query-params.hoc';
import type { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#libs/franchise/components/FranchiseCompanyLogin.component';
import { FranchiseDetails } from '#libs/franchise/types';
import { fetchFranchiseTheme } from '#libs/franchise/actions';
import {
  getFranchiseThemeLoading,
  getFranchisor,
} from '#libs/franchise/selectors';
import { STEPS } from '#libs/login/utils';
import { buildSignUpUrl } from './utils';

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
  franchisor: string;
  franchiseTheme: FranchiseDetails;
  selectedFranchisee: number;
  setSelectedFranchisee: (id: number) => void;
  goToCompanyMemberProfilePage: (id: number) => void;
  goNext: string;
  paymentPackTemplateCompanies: string;
  context: string;
  signUpNext: string;
};

type ConnectedPropsType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  ConnectedProps<typeof connector>;

type Props = OwnProps &
  ConnectedPropsType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithHandlerType<typeof mapWithHandlers>;

export class ConsumerLoginPage extends Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
    }
    if (this.props.franchisor) {
      this.props.fetchFranchiseTheme(parseInt(this.props.franchisor, 10));
    }
  }

  render() {
    const {
      authenticated,
      classes,
      t,
      theme,
      membership,
      franchisor,
      step,
      goToSignup,
      goNext,

      paymentPackTemplateCompanies,
    } = this.props;
    if (authenticated) {
      if (goNext) {
        return <Redirect to={goNext} />;
      }

      return (
        <Redirect to={`/${membership ? `?membership=${membership}` : ''}`} />
      );
    }

    if (franchisor && !this.props.franchiseTheme) {
      return null;
    }

    let companiesSelectable = this.props.franchiseTheme.companies;

    const companyList = paymentPackTemplateCompanies
      ?.split(',')
      ?.map((company) => parseInt(company));

    if (companyList?.length) {
      companiesSelectable = companiesSelectable?.filter((comp) =>
        paymentPackTemplateCompanies.includes(comp?.id),
      );
    }

    return (
      <div className={classes.container}>
        {(!franchisor || (franchisor && step === STEPS.loginToFranchise)) && (
          <Login
            doEmailLogin={this.props.doEmailLogin}
            error={this.props.errorLogin}
            errorFields={this.props.errorFields}
            loading={this.props.loginProcessing}
            requestSignUp={
              franchisor
                ? () =>
                    this.props.setQueryParams('step')(STEPS.franchiseeSelection)
                : () =>
                    this.props.replace(`/login/signup${window.location.search}`)
            }
            company={!!membership}
            isPremium={this.props.is_premium}
            theme={theme}
            t={t}
            franchisor={!!franchisor}
          />
        )}

        {franchisor && step === STEPS.franchiseeSelection && (
          <FranchiseCompanyLogin
            companies={companiesSelectable}
            authenticated={authenticated}
            disconnect={this.props.disconnect}
            selectedFranchisee={this.props.selectedFranchisee}
            setSelectedFranchisee={this.props.setSelectedFranchisee}
            goToSignup={goToSignup}
            setStep={this.props.setQueryParams('step')}
            franchisor={this.props.franchisor}
          />
        )}

        {((!!theme && membership) || franchisor) && (
          <Analytics username="" theme={theme} />
        )}
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
      dispatch(requestLogin(email, password, opts));
    },
  };
}

const properMapDispatchToProps = {
  fetchCompanyTheme,
  fetchFranchiseTheme,
  disconnect,
  pushRouter: push,
  goToCompanyMemberProfilePage: (companyId: number) => push(`c/${companyId}`),
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
  { membership, franchisor }: { membership: string; franchisor: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  authenticated: state.auth.authenticated,
  errorLogin: state.auth.error,
  loginProcessing: state.auth.loading,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
  is_premium: state.theme.theme.is_premium,
  franchiseTheme: !!franchisor && getFranchisor(state),
  franchiseThemeLoading: !!franchisor && getFranchiseThemeLoading(state),
  // membershipThemeLoading: !!membership && getThemeLoading(state),
});

const styles = (theme: Theme): any => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(1),
    width: '100%',
    overflow: 'auto',
    height: WidgetUtils.isWidget() ? '100%' : '92vh',
    marginTop: WidgetUtils.isWidget() ? 0 : '8vh',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
    },
  },
});

const connector = connect(null, properMapDispatchToProps);

export default compose(
  withRouter,
  withStyles(styles),
  withTranslation(['login']),
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
      franchisor,
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
)(ConsumerLoginPage);
