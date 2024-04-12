import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { withProps, compose } from 'recompose';
import { RootState } from '../../reducers';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
import { parseQueryString, buildUrlParams } from '../../http';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import WithCustomCssProvider from '#hocs/company-custom-css.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '../../libs/exportable-components/actions';
import ResetPasswordConfirmation from '#libs/login/components/ResetPasswordConfirmation/';

import { changePassword as changePasswordAPI } from '../../libs/login/api';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { retrieveFranchise } from '../../libs/franchise/actions';
import { getFranchisor } from '../../libs/franchise/selectors';
import ChangePasswordForm from '#components/css-only/ChangePasswordForm';
import { Franchise } from '#libs/franchise/types';

interface FranchiseWithCompany extends Franchise {
  company_theme: CompanyTheme;
  company_name: string;
}

type OwnProps = {
  match: {
    params: {
      token: null | string;
      uid: string | null;
    };
  };
  classes: Object;
  simplifyUI?: boolean;
  franchisorId?: number;
  franchisor?: FranchiseWithCompany;
  membership?: number;
};

type Props = OwnProps & WithTranslation & ConnectedProps<typeof connector>;

type State = {
  password1: string | null;
  password2: string | null;
  error: string | null;
  processing: boolean;
  hasExpired: boolean;
  passwordSuccesfullyChanged: boolean;
};

export class ChangePassword extends Component<Props, State> {
  state: State = {
    password1: null,
    password2: null,
    error: null,
    processing: false,
    hasExpired: false,
    passwordSuccesfullyChanged: false,
  };

  uid: string | null;

  token: string | null;

  componentWillMount() {
    this.uid = this.props.match.params.uid;
    this.token = this.props.match.params.token;

    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership, {
        onSuccess: (theme: CompanyTheme) => {
          if (theme.franchisor) this.props.retrieveFranchise(theme.franchisor);
        },
      });
      this.props.retrieveCompanyCssConfiguration(this.props.membership);
    }
    if (this.props.franchisor) {
      this.props.retrieveFranchise(this.props.franchisorId);
    }
  }

  handlePassword1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password1: event.target.value });
  };

  handlePassword2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password2: event.target.value });
  };

  onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ processing: true });
    const { t } = this.props;
    const { password1, password2 } = this.state;
    if (password1 !== password2) {
      this.setState({
        processing: false,
        error: t('form.login.passwordMismatch'),
      });
    } else {
      const { uid, token } = this;
      try {
        const response = await changePasswordAPI({
          uid,
          token,
          password: password1,
        });
        if (response.status !== 200) {
          this.setState({
            processing: false,
            error: t('form.login.passwordTooEasy'),
          });
        } else {
          this.setState({ passwordSuccesfullyChanged: true });
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.token) {
          this.setState({
            processing: false,
            hasExpired: true,
            error: t('form.login.tokenExpired'),
          });
        } else {
          this.setState({
            processing: false,
            error: t('form.login.passwordTooEasy'),
          });
        }
      }
    }
  };

  handlePageExit = () => {
    const { theme, pushToDefaultLogin, membership, franchisorId } = this.props;

    if (theme && theme.reset_password_url_redirection) {
      window.location.href = theme.reset_password_url_redirection;
    } else {
      pushToDefaultLogin(
        'login.passwordChangedSuccess',
        membership,
        franchisorId,
      );
    }
  };

  render() {
    const {
      franchisor,
      membership,
      franchisorId,
      simplifyUI,
      requestResetLink,
    } = this.props;
    const {
      processing,
      hasExpired,
      password1,
      error,
      password2,
      passwordSuccesfullyChanged,
    } = this.state;
    return (
      <>
        {passwordSuccesfullyChanged ? (
          <ResetPasswordConfirmation handlePageExit={this.handlePageExit} />
        ) : (
          <ChangePasswordForm
            companyTheme={this.props.theme}
            error={error}
            franchisor={franchisor}
            franchisorId={franchisorId}
            handlePassword1Change={this.handlePassword1Change}
            handlePassword2Change={this.handlePassword2Change}
            hasExpired={hasExpired}
            membership={membership}
            onSubmit={this.onSubmit}
            password1={password1}
            password2={password2}
            processing={processing}
            requestResetLink={requestResetLink}
            simplifyUI={simplifyUI}
          />
        )}
      </>
    );
  }
}

const connector = connect(
  (state: RootState, { membership }: { membership: number | null }) => ({
    theme: !!membership && themeSelectors.getTheme(state),
    simplifyUI: !!membership && getIsUISimplified(state),
    customConfiguration: state.exportableComponents.customCss,
  }),

  {
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
    fetchCompanyTheme,
    retrieveFranchise,
    requestResetLink: (
      membership: number | null,
      franchisorId: number | null,
    ) =>
      pushRouter(
        `/login/reset_password${buildUrlParams({
          ...(membership ? { membership } : {}),
          ...(franchisorId ? { franchisor: franchisorId } : {}),
        })}`,
      ),
    pushToDefaultLogin: (
      successMessage: string,
      membership: number | null,
      franchisorId: number | null,
    ) =>
      pushRouter(
        `/login${buildUrlParams({
          ...(membership ? { membership } : {}),
          ...(franchisorId ? { franchisor: franchisorId } : {}),
        })}`,
      ),
  },
);

export default compose(
  withTranslation(['translation', 'common']),
  withProps(({ location }: { location: Location }) => {
    const { membership, franchisor }: any = parseQueryString(
      location?.search || '',
    );
    return {
      membership,
      franchisorId: franchisor,
    };
  }),
  connector,
  connect((state: RootState, { theme, franchisorId }: any) => ({
    franchisor:
      theme?.franchisor || franchisorId ? getFranchisor(state) : undefined,
  })),
  WithCustomCssProvider,
)(ChangePassword);
