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
        {!WidgetUtils.isWidget() && !this.props.logoHidden && (
          <div className="bs-login-container__logo-div">
            <div>
              <img
                src={
                  this.props.theme
                    ? this.props.theme.cover
                    : 'https://cdn.bsport.io/bsport_logo_txt.png'
                }
                className="bs-login-container__logo"
                alt={
                  this.props.theme
                    ? `${this.props.theme.company_name} - logo`
                    : 'bsport-logo'
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
                id="btn-intercom"
                className="bs-login-container__icon-button"
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
                            isChecked={this.state.email === email_choice}
                            disabled={this.props.loading}
                            onClick={this.onEmailChange}
                            value={email_choice}
                            label={email_choice}
                            name={email_choice}
                            labelRight
                          />
                        </form>
                      );
                    })}
                  </div>
                </>
              </div>
            ) : (
              <FormField
                id="email"
                data-testid="email"
                name="login"
                disabled={this.props.loading}
                onChange={this.onFormFieldChange}
                fullWidth
              />
            )}
          </div>
          <div className="bs-login-container__field">
            <PasswordInput
              fullWidth
              value={this.state.password}
              disabled={
                this.props.loading ||
                (!!this.props.emailChoices && !this.state.email)
              }
              onChange={(ev: any) =>
                this.onFormFieldChange('password')(ev.target.value)
              }
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
                type="submit"
                onClick={() => openIntercomHelp('login')}
              >
                <HelpIcon />
              </IconButton>
            </div>
          ) : null}
          <Button
            className={signinButtonClass}
            disabled={this.props.loading}
            variant="contained"
            type="submit"
            id="btn-signin"
            data-testid="btn-signin"
          >
            {!!this.props.loading && (
              <CircularProgress
                className="bs-login-container__signin-button__circular-progress"
                size={24}
                color="inherit"
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
              href={`${Config.PUBLIC_URL}/login/reset_password${buildUrlParams({
                ...(this.props.theme
                  ? { membership: this.props.theme.company }
                  : {}),
                ...(this.props.franchisor
                  ? { franchisor: this.props.franchisor.id }
                  : {}),
              })}`}
              className="bs-login-container__forgotten-password__link"
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
              id="btn-goto-signup"
              variant="outlined"
              disabled={loading}
              onClick={requestSignUp}
              className="bs-login-container__register-button"
            >
              {t('actions.signup.register')}
            </Button>
            {!this.props.isPremium && !simplifyUI && (
              <div className="bs-login-container__studio-manager">
                <a
                  href={getCalendlyLinkFromCountry(
                    this.props.theme?.company_name,
                  )}
                  className="bs-link"
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
