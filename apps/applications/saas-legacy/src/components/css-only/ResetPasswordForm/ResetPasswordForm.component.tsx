import React, { ChangeEvent, FormEvent, useCallback } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@material-ui/icons/HelpOutlined';
import { Link } from 'react-router-dom';

import { DateTime } from 'luxon';
import TextField from '#Fabrique/TextField';
import Button, { ButtonColor, ButtonType } from '#Fabrique/Button';
import CircularProgress from '#src/components/css-only/CircularProgress';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import './styles.css';

export type Props = {
  hasSent: boolean;
  email: string;
  hasResetError?: boolean;
  simplifyUI?: boolean;
  last_password_reset_request: string;
  isLoading?: boolean;
  redirectUrlWithParams: string;
  redirectLogin: () => void;
  updateEmail: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const ResetPasswordForm: React.FC<Props> = ({
  hasSent,
  email,
  hasResetError,
  simplifyUI,
  redirectLogin,
  last_password_reset_request,
  isLoading,
  redirectUrlWithParams,
  updateEmail,
  onSubmit,
}) => {
  const { t } = useTranslation('authentication');

  const buttonClass = simplifyUI
    ? 'bs-reset-password-container__button--simplifyUI'
    : 'bs-reset-password-container__button';

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(event);
    },
    [onSubmit],
  );

  const hasResetPasswordProblem =
    last_password_reset_request &&
    DateTime.fromISO(last_password_reset_request) >
      DateTime.now().minus({ hours: 4 });

  return (
    <form className="bs-reset-password-form" onSubmit={handleSubmit}>
      <div className="bs-reset-password-container">
        {!hasSent && (
          <div className="bs-reset-password-container__flex-column">
            <h1 className="bs-reset-password-container__title">
              {t('resetPassword.title')}
            </h1>
            <p className="bs-reset-password-container__text-block">
              {t('resetPassword.explain1')}
            </p>
            <p className="bs-reset-password-container__text-block">
              {t('resetPassword.explain2')}
            </p>
            <TextField
              isFullWidth
              classes={{
                root: 'bs-reset-password-container__email-input bs-text-field__container--large',
              }}
              id="reset-password-field"
              inputId="reset-password-input"
              label="Email"
              name="email"
              onChange={updateEmail}
              type="email"
              value={email}
            />
          </div>
        )}
        {hasResetError && (
          <div
            className={clsx(
              'bs-reset-password-container__error-text',
              'bs-reset-password-container__caption-text',
            )}
          >
            {t('resetPassword.noEmail')}
          </div>
        )}
        <div
          className={
            hasSent
              ? 'bs-reset-password-container__div-send-success-msg'
              : 'bs-reset-password-container__div-send-buttons'
          }
        >
          {hasSent ? (
            <>
              <div>
                {t('resetPassword.emailHasBeenSent', {
                  email,
                })}
              </div>
              {hasResetPasswordProblem && (
                <div className="bs-reset-password-container__help-reset">
                  <WarningIcon
                    className="bs-reset-password-container__help-icon"
                    color="secondary"
                    fontSize="large"
                  />
                  <div>
                    <div className="bs-reset-password-container__error-text">
                      {t('resetPassword.hasProblem')}
                    </div>
                    <div className="bs-reset-password-container__contact-us">
                      <div className="bs-reset-password-container__contact-us__text">
                        {t('resetPassword.contactUs')}
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
                    root: clsx(
                      buttonClass,
                      'bs-reset-password-container__back-to-login-button',
                    ),
                  }}
                  color={ButtonColor.PRIMARY}
                  id="btn-back-to-login"
                  onClick={redirectLogin}
                >
                  {t('resetPassword.actions.backToLogin')}
                </Button>
              </div>
            </>
          ) : (
            <div className="bs-reset-password-container__sending-buttons">
              <Link
                className="bs-reset-password-container__link"
                to={redirectUrlWithParams}
              >
                <Button
                  classes={{
                    root: clsx(
                      buttonClass,
                      'bs-reset-password-container__button-cancel',
                    ),
                  }}
                  id="btn-cancel"
                >
                  {t('resetPassword.actions.cancel')}
                </Button>
              </Link>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Button
                  classes={{
                    root: clsx(
                      buttonClass,
                      'bs-reset-password-container__button-submit',
                    ),
                  }}
                  color={ButtonColor.PRIMARY}
                  id="btn-reset-password"
                  type={ButtonType.SUBMIT}
                >
                  {simplifyUI
                    ? t('resetPassword.actions.confirm')
                    : t('resetPassword.actions.reset')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export const ResetPasswordFormStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ResetPasswordForm>>()(
    ResetPasswordForm,
  );

export default React.memo(ResetPasswordForm);
