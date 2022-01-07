// @flow

import React, { Component } from 'react';
import { compose, withProps, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
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

import type { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#libs/franchise/components/FranchiseCompanyLogin.component';
import { FranchiseDetails } from '#libs/franchise/types';
import { fetchFranchiseTheme } from '#libs/franchise/actions';
import {
  getFranchiseThemeLoading,
  getFranchisor,
} from '#libs/franchise/selectors';
import { STEPS } from '#libs/login/utils';

type OwnProps = {
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
  membership: string;
  franchisor: string;
  franchiseTheme: FranchiseDetails;
  goToSignup: (id: string | null) => void;
  step: number;
  setStep: (step: number) => void;
  selectedFranchisee: number;
  setSelectedFranchisee: (id: number) => void;
  goToCompanyMemberProfilePage: (id: number) => void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  typeof properMapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

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
    } = this.props;

    if (authenticated) {
      const { next, membership } = parseQueryString(this.props.location.search);
      if (next) {
        return <Redirect to={next} />;
      }
      return (
        <Redirect to={`/${membership ? `?membership=${membership}` : ''}`} />
      );
    }

    if (franchisor && !this.props.franchiseTheme) {
      return null;
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
                ? () => this.props.setStep(STEPS.franchiseeSelection)
                : () => goToSignup(membership)
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
            companies={this.props.franchiseTheme.companies}
            authenticated={authenticated}
            disconnect={this.props.disconnect}
            selectedFranchisee={this.props.selectedFranchisee}
            setSelectedFranchisee={this.props.setSelectedFranchisee}
            goToSignup={goToSignup}
            setStep={this.props.setStep}
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
  // goToSignup: ({
  //   membership,
  //   franchisor,
  // }: {
  //   membership: string | null;
  //   franchisor: string | null;
  // }) => {
  //   if (membership) {
  //     if (franchisor) {
  //       push(`/login/signup?membership=${membership}&franchisor=${franchisor}`);
  //     } else {
  //       push(`/login/signup?membership=${membership}`);
  //     }
  //   } else {
  //     push(`/login/signup`);
  //   }
  // },
  goToSignup: (membership: string | null) =>
    membership
      ? push(`/login/signup?membership=${membership}`)
      : push(`/login/signup`),
  goToCompanyMemberProfilePage: (companyId: number) => push(`c/${companyId}`),
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

export default compose(
  withRouter,
  withStyles(styles),
  withTranslation(['login']),
  withState('step', 'setStep', STEPS.loginToFranchise),
  withState('selectedFranchisee', 'setSelectedFranchisee', null),
  withProps((props: OwnProps) => ({
    membership: parseQueryString(props.location.search).membership,
    franchisor: parseQueryString(props.location.search).franchisor,
    goNext: parseQueryString(props.location.search).next,
  })),
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
)(ConsumerLoginPage);
