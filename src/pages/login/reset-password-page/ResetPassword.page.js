import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { compose, withProps } from 'recompose';
import { Redirect, Link } from 'react-router-dom';
import WarningIcon from '@material-ui/icons/HelpOutlined';
import classnames from 'classnames';
import { withTranslation, TFunction } from 'react-i18next';

import CircularProgress from '#csscomponents/CircularProgress';
import TextField from '#Fabrique/TextField';
import Button from '#Fabrique/Button';
import { parseQueryString, buildUrlParams } from '../../../http';
import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';

import { resetPassword } from '../../../actions/auth.actions';
import { getIsUISimplified } from '#libs/theme/selectors';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '../../../libs/exportable-components/actions';

import './ResetPasswordStyles.css';

type Props = {
  resetPassword: (
    email: string,
    companyId: number | null,
    options: any,
  ) => void,
  loading: boolean,
  resetError: ?Error,
  t: TFunction,
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

  onSubmit = (event: Object) => {
    event.preventDefault();
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

  getSendingButton = (buttonClass) => (
    <div className="bs-reset-password-container__sending-buttons">
      <Link
        className="bs-reset-password-container__link"
        to={this.getRedirectUrlWithParams()}
      >
        <Button
          classes={{
            root: classnames(
              buttonClass,
              'bs-reset-password-container__button-cancel',
            ),
          }}
          id="btn-cancel"
        >
          {this.props.t('resetPassword.actions.cancel')}
        </Button>
      </Link>
      {this.props.loading ? (
        <CircularProgress />
      ) : (
        <Button
          classes={{
            root: classnames(
              buttonClass,
              'bs-reset-password-container__button-submit',
            ),
          }}
          color="primary"
          id="btn-reset-password"
          type="submit"
          variant="contained"
        >
          {this.props.simplifyUI
            ? this.props.t('resetPassword.actions.confirm')
            : this.props.t('resetPassword.actions.reset')}
        </Button>
      )}
    </div>
  );

  resetComponent = () => {
    this.setState({ hasSent: false });
  };

  redirectLogin = () => {
    this.setState({
      redirectLogin: true,
    });
  };

  getSuccessMsg = (buttonClass) => (
    <div>
      <div>
        {this.props.t('resetPassword.emailHasBeenSent', {
          email: this.state.email,
        })}
      </div>
      {this.props.last_password_reset_request &&
        moment(this.props.last_password_reset_request).isAfter(
          moment().add(-4, 'hours'),
        ) && (
          <div className="bs-reset-password-container__help-reset">
            <WarningIcon
              className="bs-reset-password-container__help-icon"
              color="secondary"
              fontSize="large"
            />
            <div>
              <div className="bs-reset-password-container__error-text">
                {this.props.t('resetPassword.hasProblem')}
              </div>
              <div className="bs-reset-password-container__contact-us">
                <div className="bs-reset-password-container__contact-us__text">
                  {this.props.t('resetPassword.contactUs')}
                </div>
                <a href="mailto:support+reset-password@bsport.io">
                  support+reset-password@bsport.io
                </a>
              </div>
            </div>
          </div>
        )}
      <div className="bs-reset-password-container__div__back-to-login">
        <Button
          classes={{
            root: classnames(
              buttonClass,
              'bs-reset-password-container__back-to-login-button',
            ),
          }}
          color="primary"
          id="btn-back-to-login"
          onClick={this.redirectLogin}
          variant="contained"
        >
          {this.props.t('resetPassword.actions.backToLogin')}
        </Button>
      </div>
    </div>
  );

  render() {
    const { hasSent, redirectLogin, email } = this.state;
    const buttonClass = this.props.simplifyUI
      ? 'bs-reset-password-container__button--simplifyUI'
      : 'bs-reset-password-container__button';
    if (redirectLogin) {
      return <Redirect to={this.getRedirectUrlWithParams()} />;
    }
    return (
      <form className="bs-reset-password-form" onSubmit={this.onSubmit}>
        {this.props.customConfiguration && (
          <ApplyCustomCssStyles
            customConfiguration={this.props.customConfiguration}
          />
        )}

        <div className="bs-reset-password-container">
          {!hasSent && (
            <div className="bs-reset-password-container__flex-column">
              <h1 className="bs-reset-password-container__title">
                {this.props.t('resetPassword.title')}
              </h1>
              <p className="bs-reset-password-container__text-block">
                {this.props.t('resetPassword.explain1')}
              </p>
              <p className="bs-reset-password-container__text-block">
                {this.props.t('resetPassword.explain2')}
              </p>
              <TextField
                isFullWidth
                classes={{
                  root: 'bs-reset-password-container__email-input bs-text-field__container--large',
                }}
                label="Email"
                name="email"
                onChange={this.updateEmail}
                type="email"
                value={email}
              />
            </div>
          )}
          {this.props.resetError ? (
            <div
              className={classnames(
                'bs-reset-password-container__error-text',
                'bs-reset-password-container__caption-text',
              )}
            >
              {this.props.t('resetPassword.noEmail')}
            </div>
          ) : null}
          <div
            className={classnames({
              'bs-reset-password-container__div-send-success-msg': hasSent,
              'bs-reset-password-container__div-send-buttons': !hasSent,
            })}
          >
            {hasSent
              ? this.getSuccessMsg(buttonClass)
              : this.getSendingButton(buttonClass)}
          </div>
        </div>
      </form>
    );
  }
}

export default compose(
  withTranslation('authentication'),
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
