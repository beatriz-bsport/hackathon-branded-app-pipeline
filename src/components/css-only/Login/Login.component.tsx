import React, { Component } from 'react';
import classnames from 'classnames';

import HelpIcon from '@material-ui/icons/Help';
import { withTranslation, WithTranslation } from 'react-i18next';

import { CompanyTheme } from '#libs/theme/types';
import Button, { ButtonVariant } from '#Fabrique/Button';
import LoginForm from '#components/css-only/LoginForm';
import { openIntercomHelp } from '../../../intercom';
import getCalendlyLinkFromCountry from '../../../i18n/utils/calendly-link-language';
import WidgetUtils from '#libs/widget/WidgetUtils';
import Config from '../../../config';
import { Franchise } from '#libs/franchise/types';
import { buildUrlParams } from '../../../http';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './LoginBackground.css';
import './styles.css';

export type Props = {
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

  onFormFieldChange = (id: 'email' | 'password') => (value: string) => {
    if (id === 'email') {
      this.setState({ [id]: value });
    } else if (id === 'password') {
      this.setState({ [id]: value });
    }
  };

  onEmailChange = (value: string) => this.onFormFieldChange('email')(value);

  handleOpenIntercomHelp = () => openIntercomHelp('login');

  getHrefLink = () => {
    return `${Config.PUBLIC_URL}/login/reset_password${buildUrlParams({
      ...(this.props.theme ? { membership: this.props.theme.company } : {}),
      ...(this.props.franchisor
        ? { franchisor: this.props.franchisor.id }
        : {}),
    })}`;
  };

  doEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;
    event.preventDefault();
    this.props.doEmailLogin({ email, password });
  };

  render() {
    const { simplifyUI, loading, t, hideRegister, errorFields, error } =
      this.props;

    const { requestSignUp } = this.props;

    const signUpDividerClass = WidgetUtils.isWidget()
      ? 'bs-login-container__signup-divider--widget'
      : 'bs-login-container__signup-divider--default';

    let errorMessage = t('error.authError');

    if (errorFields && errorFields.password) {
      errorMessage = t('error.invalidPassword');
    }
    if (errorFields && errorFields.email) {
      errorMessage = t('error.invalidEmail');
    }

    const rectangleClass =
      this.props.company || this.props.franchisor
        ? 'bs-rectangle--company'
        : 'bs-rectangle--default';

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
                  className={classnames(rectangleClass, 'rectangle-animated')}
                />
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
            errorMessage={errorMessage}
            hasCompany={!!this.props.company}
            hasError={error}
            hasFranchisor={!!this.props.franchisor}
            hrefLink={this.getHrefLink()}
            isLoading={loading}
            onChangeField={this.onFormFieldChange}
            onOpenIntercomHelp={this.handleOpenIntercomHelp}
            onSubmit={this.doEmailLogin}
            password={this.state.password}
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
      </div>
    );
  }
}

export const LoginStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerLogin>>()(
    ConsumerLogin,
  );

export default withTranslation('login')(ConsumerLogin);
