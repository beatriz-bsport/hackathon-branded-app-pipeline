import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Redirect } from 'react-router-dom';

import ResetPasswordForm from '#csscomponents/ResetPasswordForm';
import { parseQueryString, buildUrlParams } from '../../../http';
import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';

import { resetPassword } from '../../../actions/auth.actions';
import { getIsUISimplified } from '#libs/theme/selectors';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '../../../libs/exportable-components/actions';

import { MarketplaceCSSConfiguration } from '#libs/exportable-components/types';

type Props = {
  resetPassword: (
    email: string,
    companyId: number | null,
    options: any,
  ) => void,
  loading: boolean,
  resetError: ?Error,
  last_password_reset_request: string,
  membership: null | number,
  franchisorId: ?string,
  simplifyUI?: boolean,
  customConfiguration: MarketplaceCSSConfiguration,
  retrieveCompanyCssConfiguration: (
    company: number,
    options?: OptionCallback<MarketplaceCSSConfiguration[]>,
  ) => Promise<void>,
};

type State = {
  email: string,
  hasSent: boolean,
  redirectLogin: boolean,
};

export class ResetPassword extends Component<Props, State> {
  state = {
    email: '',
    hasSent: false,
    redirectLogin: false,
  };

  componentDidMount() {
    if (this.props.membership) {
      this.props.retrieveCompanyCssConfiguration(this.props.membership);
    }
  }

  updateEmail = (event: Object) => {
    this.setState({
      email: event.target.value,
    });
  };

  onSubmit = () => {
    if (!this.state.email) {
      return;
    }
    this.resetPassword();
  };

  resetPassword = () => {
    this.props.resetPassword(
      this.state.email,
      this.props.membership,
      this.props.franchisorId && parseInt(this.props.franchisorId, 10),
      {
        onSuccess: () => this.setState({ hasSent: true }),
      },
    );
  };

  getRedirectUrlWithParams = () => {
    const loginPathParams = {};
    if (this.props.membership) {
      loginPathParams.membership = this.props.membership;
    }
    if (this.props.franchisorId) {
      loginPathParams.franchisor = this.props.franchisorId;
    }
    return `/login${buildUrlParams(loginPathParams)}`;
  };

  resetComponent = () => {
    this.setState({ hasSent: false });
  };

  redirectLogin = () => {
    this.setState({
      redirectLogin: true,
    });
  };

  render() {
    if (this.state.redirectLogin) {
      return <Redirect to={this.getRedirectUrlWithParams()} />;
    }
    return (
      <>
        {this.props.customConfiguration && (
          <ApplyCustomCssStyles
            customConfiguration={this.props.customConfiguration}
          />
        )}

        <ResetPasswordForm
          customConfiguration={this.props.customConfiguration}
          email={this.state.email}
          hasResetError={!!this.props.resetError}
          hasSent={this.state.hasSent}
          isLoading={this.props.loading}
          last_password_reset_request={this.props.last_password_reset_request}
          onSubmit={this.onSubmit}
          redirectLogin={this.redirectLogin}
          redirectUrlWithParams={this.getRedirectUrlWithParams()}
          simplifyUI={this.props.simplifyUI}
          updateEmail={this.updateEmail}
        />
      </>
    );
  }
}

export default compose(
  withProps((props) => ({
    membership: parseQueryString(props.location.search)?.membership,
    franchisorId: parseQueryString(props.location.search)?.franchisor,
  })),
  connect(
    (state, { membership }) => {
      return {
        resetError: state.auth.resetPassword.error,
        loading:
          state.auth.resetPassword.loading &&
          state.exportableComponents.loading,
        last_password_reset_request:
          state.auth.resetPassword.last_password_reset_request,
        simplifyUI: !!membership && getIsUISimplified(state),
        customConfiguration: state.exportableComponents.customCss,
      };
    },
    {
      resetPassword,
      retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
    },
  ),
)(ResetPassword);
