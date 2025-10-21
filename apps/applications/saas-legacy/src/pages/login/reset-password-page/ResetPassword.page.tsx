import React, { Component } from 'react';
import { connect, ConnectedProps as ConnectedPropsRedux } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Redirect, RouterProps } from 'react-router-dom';
import ResetPasswordForm from '#src/components/css-only/ResetPasswordForm';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import themeSelectors from '#src/libs/theme/selectors';
import { parseQueryString, buildUrlParams } from '../../../http';
// @ts-expect-errors
import { resetPassword } from '../../../actions/auth.actions';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '../../../libs/exportable-components/actions';

import type { RootState } from '../../../reducers';
import { trackResetPasswordViewedEvent } from '#src/events/authentication/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

type LocationProps = { location: Location };

type WithQueryParamsProps = {
  membership: null | string;
  franchisorId?: string;
  /**
   * Retrieving the location (as URI) where the login page wanted to go at first
   * */
  originalLoginNextLink?: string;
  context?: string;
};

type ConnectedProps = ConnectedPropsRedux<typeof connector> & {
  resetPassword: (
    email: string,
    companyId: number | null,
    options: any,
  ) => void;
  last_password_reset_request: string;
};
type Props = ConnectedProps &
  LocationProps &
  WithQueryParamsProps &
  RouterProps;

type State = {
  email: string;
  hasSent: boolean;
  redirectLogin: boolean;
};

export class ResetPassword extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      hasSent: false,
      redirectLogin: false,
    };
  }

  componentDidMount() {
    if (this.props.membership) {
      this.props.retrieveCompanyCssConfiguration(
        parseInt(this.props.membership),
      );
    }
    analyticsClientB2C.track(trackResetPasswordViewedEvent({}));
  }

  updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (this.props.originalLoginNextLink) {
      return `${this.props.originalLoginNextLink}`;
    }
    const loginPathParams = {} as { membership?: string; franchisor?: string };
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
        <ResetPasswordForm
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

const connector = connect(
  (state: RootState, { membership }: WithQueryParamsProps) => {
    return {
      resetError: state.auth.resetPassword.error,
      loading:
        state.auth.resetPassword.loading && state.exportableComponents.loading,
      last_password_reset_request:
        state.auth.resetPassword.last_password_reset_request,
      simplifyUI: !!membership,
      customConfiguration: state.exportableComponents.customCss,
      theme: !!membership && themeSelectors.getTheme(state),
    };
  },
  {
    resetPassword,
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  },
);

export default compose(
  withProps((props: LocationProps) => ({
    membership: parseQueryString(props.location.search)?.membership,
    franchisorId: parseQueryString(props.location.search)?.franchisor,
    originalLoginNextLink:
      props.location?.search &&
      props.location.search?.indexOf('originalLoginNextLink') !== -1
        ? props.location.search.substring(
            props.location.search?.indexOf('originalLoginNextLink') +
              'originalLoginNextLink'.length +
              1,
          )
        : '',
    context: parseQueryString(props.location.search)?.context,
  })),
  connector,
  WithCustomCssProvider,
)(ResetPassword);
