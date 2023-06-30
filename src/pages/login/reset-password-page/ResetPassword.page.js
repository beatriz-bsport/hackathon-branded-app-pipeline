import React, { Component } from 'react';

import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { compose, withProps } from 'recompose';
import { Redirect, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/HelpOutlined';
import { TextField } from '@material-ui/core';
import classnames from 'classnames';
import './ResetPasswordStyles.css';

import { withTranslation, TFunction } from 'react-i18next';
import { parseQueryString, buildUrlParams } from '../../../http';

import { resetPassword } from '../../../actions/auth.actions';

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
        <Button id="btn-cancel" className={buttonClass}>
          {this.props.t('resetPassword.actions.cancel')}
        </Button>
      </Link>
      {this.props.loading ? (
        <CircularProgress />
      ) : (
        <Button
          className={buttonClass}
          type="submit"
          color="primary"
          variant="contained"
          id="btn-reset-password"
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
              fontSize="large"
              color="secondary"
              className="bs-reset-password-container__help-icon"
            />
            <div>
              <div className="bs-reset-password-container__error-text">
                {this.props.t('resetPassword.hasProblem')}
              </div>
              <div className="bs-reset-password-container__contact-us">
                <div className="bs-reset-password-container__div--margin-right">
                  {this.props.t('resetPassword.contactUs')}
                </div>
                <a href="mailto:support+reset-password@bsport.io">
                  support+reset-password@bsport.io
                </a>
              </div>
            </div>
          </div>
        )}
      <div className="bs-reset-password-container__div--padding-top-20">
        <Button
          className={buttonClass}
          color="primary"
          onClick={this.redirectLogin}
          variant="contained"
          id="btn-back-to-login"
        >
          {this.props.t('resetPassword.actions.backToLogin')}
        </Button>
      </div>
    </div>
  );

  render() {
    const { hasSent, redirectLogin } = this.state;
    const buttonClass = this.props.simplifyUI
      ? 'bs-reset-password-container__button--simplifyUI'
      : 'bs-reset-password-container__button';
    if (redirectLogin) {
      return <Redirect to={this.getRedirectUrlWithParams()} />;
    }
    return (
      <form onSubmit={this.onSubmit} className="bs-reset-password-container">
        {hasSent ? (
          <div />
        ) : (
          <div className="bs-reset-password-container__flex-column">
            <div className="bs-reset-password-container__title">
              {this.props.t('resetPassword.title')}
            </div>
            <div className="bs-reset-password-container__text-block">
              {this.props.t('resetPassword.explain1')}
            </div>
            <div className="bs-reset-password-container__text-block">
              {this.props.t('resetPassword.explain2')}
            </div>
            <TextField
              type="email"
              className="bs-reset-password-container__text-block"
              onChange={this.updateEmail}
              variant="outlined"
              name="email"
              fullWidth
              label="Email"
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
        <div className="bs-reset-password-container__div-send-buttons">
          {!hasSent
            ? this.getSendingButton(buttonClass)
            : this.getSuccessMsg(buttonClass)}
        </div>
      </form>
    );
  }
}

export default compose(
  withTranslation(['authentication']),
  connect(
    (state) => ({
      resetError: state.auth.resetPassword.error,
      loading: state.auth.resetPassword.loading,
      last_password_reset_request:
        state.auth.resetPassword.last_password_reset_request,
    }),
    { resetPassword },
  ),
  withProps((props) => ({
    membership: parseQueryString(props.location.search)?.membership,
    franchisorId: parseQueryString(props.location.search)?.franchisor,
  })),
)(ResetPassword);
