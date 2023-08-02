import React, { Component } from 'react';
import classnames from 'classnames';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, IconButton } from '@material-ui/core';
import './LoginBackground.css';
import './Login.css';
import HelpIcon from '@material-ui/icons/Help';
import { withTranslation, WithTranslation } from 'react-i18next';

import { CompanyTheme } from '#libs/theme/types';
import PasswordInput from '#components/input/PasswordInput.component';
import Radio from '#components/css-only/Radio';
// @ts-expect-error
import FormField from '#components/input/FormField.component';
import { openIntercomHelp } from '../../../intercom';
import getCalendlyLinkFromCountry from '../../../i18n/utils/calendly-link-language';
import WidgetUtils from '#libs/widget/WidgetUtils';
import Config from '../../../config';
import { Franchise } from '#libs/franchise/types';
import { buildUrlParams } from '../../../http';

type Props = {
  doEmailLogin: (Obj: { email: string; password: string }) => void;
  requestSignUp?: () => void;
  loading: boolean;
  classes: any;
  error?: boolean;
  errorFields?: {
    email?: string;
    password?: string;
  };
  simplifyUI?: boolean;
  isPremium?: boolean;
  company?: boolean;
  theme?: CompanyTheme;
  logoHidden?: boolean;
  marketplace?: boolean;
  franchisor?: Franchise;
  hideRegister?: boolean;
  emailChoices?: Array<string>;
} & WithTranslation;

type State = {
  email: string;
  password: string;
};

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onFormFieldChange = (id: string) => (value: string) => {
    if (id === 'email') {
      this.setState({ [id]: value });
    } else if (id === 'password') {
      this.setState({ [id]: value });
    }
  };

  onEmailChange = (value: string) => this.onFormFieldChange('email')(value);

  getEmailLogin = () => {
    const { simplifyUI, error, errorFields, t } = this.props;
    let errorMessage = t('error.authError');

    if (errorFields && errorFields.password) {
      errorMessage = t('error.invalidPassword');
    }
    if (errorFields && errorFields.email) {
      errorMessage = t('error.invalidEmail');
    }
    let signinButtonClass = 'bs-login-container__signin-button--default';
    if (simplifyUI) {
      if (this.props.company || this.props.franchisor) {
        signinButtonClass =
          'bs-login-container__signin-button--simplifyUI-company';
      } else {
        signinButtonClass = 'bs-login-container__signin-button--simplifyUI';
      }
    } else if (this.props.company || this.props.franchisor) {
      signinButtonClass = 'bs-login-container__signin-button--company';
    }

    if (this.props.loading) {
      signinButtonClass += '--loading';
    }

    const rectangleClass =
      this.props.company || this.props.franchisor
        ? 'bs-rectangle--company'
        : 'bs-rectangle--default';
    return (
      <div
        className={`${'bs-flex-column--center'} ${'bs-login-container__get-email-login'}`}
      >
        {!WidgetUtils.isWidget() && !this.props.logoHidden && !simplifyUI && (
          <div className="bs-login-container__logo-div">
            <div>
              <img
                alt={
                  this.props.theme
                    ? `${this.props.theme.company_name} - logo`
                    : 'bsport-logo'
                }
                className="bs-login-container__logo"
                src={
                  this.props.theme
                    ? this.props.theme.cover
                    : 'https://cdn.bsport.io/bsport_logo_txt.png'
                }
              />
            </div>
          </div>
        )}
        <div className="bs-flex-row">
          <div
            className={classnames(
              'bs-flex-column--center',
              'bs-login-container__connection-title',
            )}
          >
            <div className="bs-login-container__connection">
              {t('signin.connection')}
            </div>
            {!simplifyUI && (
              <div
                className={classnames(rectangleClass, 'reactangle-animated')}
              />
            )}
            {!simplifyUI && (
              <IconButton
                className="bs-login-container__icon-button"
                id="btn-intercom"
                onClick={() => openIntercomHelp('login')}
              >
                <HelpIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div className="bs-login-container__connect">
          <div className="bs-login-container__body1-text">
            {t('signin.connect')}
          </div>
        </div>
        <form className="bs-column" onSubmit={this.doEmailLogin}>
          <div className="bs-login-container__field">
            {this.props.emailChoices ? (
              <div id="email-choices">
                <>
                  <div
                    className={classnames(
                      'bs-login-container__email-choice-label',
                      'bs-login-container__body1-text',
                    )}
                  >
                    {t('signin.selectYourCurrentEmail')}
                  </div>
                  <div className="bs-flex-column--align-left">
                    {this.props.emailChoices?.map((email_choice) => {
                      return (
                        <form className="bs-flex-row">
                          <Radio
                            labelRight
                            disabled={this.props.loading}
                            isChecked={this.state.email === email_choice}
                            label={email_choice}
                            name={email_choice}
                            onClick={this.onEmailChange}
                            value={email_choice}
                          />
                        </form>
                      );
                    })}
                  </div>
                </>
              </div>
            ) : (
              <FormField
                fullWidth
                data-testid="email"
                disabled={this.props.loading}
                id="email"
                name="login"
                onChange={this.onFormFieldChange}
              />
            )}
          </div>
          <div className="bs-login-container__field">
            <PasswordInput
              fullWidth
              disabled={
                this.props.loading ||
                (!!this.props.emailChoices && !this.state.email)
              }
              onChange={(ev: any) =>
                this.onFormFieldChange('password')(ev.target.value)
              }
              value={this.state.password}
            />
          </div>
          {error ? (
            <div
              className={classnames(
                'bs-login-container__error-message',
                'bs-flex-row',
              )}
            >
              <div
                className={classnames(
                  'bs-login-container__error-text',
                  'bs-login-container__body2-text',
                )}
              >
                {errorMessage}
              </div>
              <IconButton
                id="btn-intercom-error"
                onClick={() => openIntercomHelp('login')}
                type="submit"
              >
                <HelpIcon />
              </IconButton>
            </div>
          ) : null}
          <Button
            className={signinButtonClass}
            data-testid="btn-signin"
            disabled={this.props.loading}
            id="btn-signin"
            type="submit"
            variant="contained"
          >
            {!!this.props.loading && (
              <CircularProgress
                className="bs-login-container__signin-button__circular-progress"
                color="inherit"
                size={24}
              />
            )}
            {t('actions.signin')}
          </Button>
          <div
            className={classnames(
              'bs-flex-row',
              'bs-login-container__forgotten-password',
            )}
          >
            <a
              className="bs-login-container__forgotten-password__link"
              href={`${Config.PUBLIC_URL}/login/reset_password${buildUrlParams({
                ...(this.props.theme
                  ? { membership: this.props.theme.company }
                  : {}),
                ...(this.props.franchisor
                  ? { franchisor: this.props.franchisor.id }
                  : {}),
              })}`}
            >
              <p
                className={classnames(
                  'bs-login-container__forgotten-password__link__text',
                  'bs-login-container__body2-text',
                )}
              >
                {t('actions.forgottenPassword')}
              </p>
            </a>
          </div>
        </form>
      </div>
    );
  };

  doEmailLogin = (e: any) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.doEmailLogin({ email, password });
  };

  render() {
    const { simplifyUI, loading, t, hideRegister } = this.props;

    const { requestSignUp } = this.props;

    const signUpDividerClass = WidgetUtils.isWidget()
      ? 'bs-login-container__signup-divider--widget'
      : 'bs-login-container__signup-divider--default';

    return (
      <div
        className={classnames('bs-login-container', 'bs-flex-column--center')}
      >
        {this.getEmailLogin()}
        {!hideRegister && (
          <>
            <div className={signUpDividerClass} />
            <div className="bs-login-container__body2-text">
              {t('actions.signup.noAccount')}
            </div>
            <Button
              className="bs-login-container__register-button"
              disabled={loading}
              id="btn-goto-signup"
              onClick={requestSignUp}
              variant="outlined"
            >
              {t('actions.signup.register')}
            </Button>
            {!this.props.isPremium && !simplifyUI && (
              <div className="bs-login-container__studio-manager">
                <a
                  className="bs-link"
                  href={getCalendlyLinkFromCountry(
                    this.props.theme?.company_name,
                  )}
                >
                  <div className="bs-login-container__body2-text">
                    {t('contactUs')}
                  </div>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default compose<any, Props>(withTranslation(['login']))(ConsumerLogin);
