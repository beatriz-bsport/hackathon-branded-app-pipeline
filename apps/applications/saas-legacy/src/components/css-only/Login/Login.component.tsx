import React, { Component } from 'react';
import clsx from 'clsx';

import HelpIcon from '@material-ui/icons/Help';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  DIALOG_MODE_DEACTIVATED,
  DIALOG_MODE_IFRAME,
} from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { CompanyTheme } from '#src/libs/theme/types';
import Button, { ButtonVariant } from '#Fabrique/Button';
import LoginForm from '#src/components/css-only/LoginForm';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import type { Franchise } from '#src/libs/franchise/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { openIntercomHelp } from '#src/intercom';
import getCalendlyLinkFromCountry from '#src/i18n/utils/calendly-link-language';
import { buildUrlParams } from '#src/http';
import './LoginBackground.css';
import './styles.css';

export type Props = {
  doEmailLogin: (Obj: { email: string; password: string }) => void;
  requestSignUp?: () => void;
  onRequestResetPassword: (url: string) => void;
  loading: boolean;
  error?: boolean;
  simplifyUI?: boolean;
  isPremium?: boolean;
  company?: boolean;
  theme?: CompanyTheme;
  logoHidden?: boolean;
  franchisor?: Franchise;
  hideRegister?: boolean;
  emailChoices?: Array<string>;
  context?: string;
  /*
   ** To not disrup login flow when going on the reset password page (in URI)
   */
  originalLoginNextLink?: string;
  bookingFlowIsNext?: boolean;
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

  onFormFieldChange = (id: 'email' | 'password') => (value: string) => {
    if (id === 'email') {
      this.setState({ [id]: value });
    } else if (id === 'password') {
      this.setState({ [id]: value });
    }
  };

  onEmailChange = (value: string) => this.onFormFieldChange('email')(value);

  handleOpenIntercomHelp = () => openIntercomHelp('login');

  requestResetPassword = () => {
    const url = `/login/reset_password${buildUrlParams({
      ...(this.props.theme ? { membership: this.props.theme.company } : {}),
      ...(this.props.franchisor
        ? { franchisor: this.props.franchisor.id }
        : {}),
      ...(this.props.originalLoginNextLink
        ? { originalLoginNextLink: this.props.originalLoginNextLink }
        : {}),
      ...(this.props.context ? { context: this.props.context } : {}),
    })}`;
    this.props.onRequestResetPassword(url);
  };

  doEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;
    event.preventDefault();
    this.props.doEmailLogin({ email, password });
  };

  closeWidgetModalOnGoBack = () => WidgetUtils.closeModal();

  render() {
    const { simplifyUI, loading, t, hideRegister, error, bookingFlowIsNext } =
      this.props;

    const { requestSignUp } = this.props;

    const signUpDividerClass = WidgetUtils.isWidget()
      ? 'bs-login-container__signup-divider--widget'
      : 'bs-login-container__signup-divider--default';

    const rectangleClass =
      this.props.company || this.props.franchisor
        ? 'bs-rectangle--company'
        : 'bs-rectangle--default';

    const loginTitle = bookingFlowIsNext
      ? t('signup.titleAsResgisterBooking')
      : t('signin.connection');

    return (
      <div className="bs-login-container bs-flex-column--center">
        <div className="bs-flex-column--center bs-login-container__get-email-login">
          {!WidgetUtils.isWidget() && !this.props.logoHidden && !simplifyUI && (
            <div className="bs-login-container__logo-container">
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
              className={clsx(
                'bs-flex-column--center',
                'bs-login-container__connection-title',
              )}
            >
              <div className="bs-login-container__connection">{loginTitle}</div>
              {!simplifyUI && (
                <div className={clsx(rectangleClass, 'rectangle-animated')} />
              )}
              {!simplifyUI && (
                <Button
                  classes={{ root: 'bs-login-container__icon-button' }}
                  id="btn-intercom"
                  onClick={this.handleOpenIntercomHelp}
                  variant={ButtonVariant.ICON}
                >
                  <HelpIcon />
                </Button>
              )}
            </div>
          </div>
          <div className="bs-login-container__connect">
            <div className="bs-login-container__body1-text">
              {t('signin.connect')}
            </div>
          </div>

          <LoginForm
            email={this.state.email}
            emailChoices={this.props.emailChoices}
            errorMessage={t('error.authError')}
            hasCompany={!!this.props.company}
            hasError={error}
            hasFranchisor={!!this.props.franchisor}
            isLoading={loading}
            onChangeField={this.onFormFieldChange}
            onOpenIntercomHelp={this.handleOpenIntercomHelp}
            onSubmit={this.doEmailLogin}
            password={this.state.password}
            requestResetPassword={this.requestResetPassword}
            simplifyUI={this.props.simplifyUI}
          />
        </div>

        {!hideRegister && (
          <>
            <div className={signUpDividerClass} />
            <div className="bs-login-container__body2-text">
              {t('actions.signup.noAccount')}
            </div>
            <Button
              classes={{ root: 'bs-login-container__register-button' }}
              id="btn-goto-signup"
              isDisabled={loading}
              onClick={requestSignUp}
              variant={ButtonVariant.OUTLINED}
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

        {WidgetUtils.isWidget() &&
          [DIALOG_MODE_IFRAME, DIALOG_MODE_DEACTIVATED].includes(
            WidgetUtils.getDialogMode(),
          ) && (
            <Button
              classes={{ root: 'bs-login-container--go_back_button' }}
              isDisabled={loading}
              onClick={this.closeWidgetModalOnGoBack}
              variant={ButtonVariant.TEXT}
            >
              {t('actions.signup.goBack')}
            </Button>
          )}
      </div>
    );
  }
}

export const LoginStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerLogin>>()(
    ConsumerLogin,
  );

export default withTranslation('login')(ConsumerLogin);
