import React, { ChangeEvent, FormEvent, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@material-ui/icons/Help';

import TextField from '#Fabrique/TextField';
import Button, { ButtonType, ButtonVariant } from '#Fabrique/Button';
import CircularProgress from '#csscomponents/CircularProgress';
import Radio from '#csscomponents/Radio';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  emailChoices?: string[];
  isLoading?: boolean;
  email: string;
  password: string;
  hasError?: boolean;
  errorMessage: string;
  hasCompany?: boolean;
  hasFranchisor?: boolean;
  simplifyUI?: boolean;
  hrefLink: string;
  onOpenIntercomHelp: () => void;
  onChangeField: (id: 'email' | 'password') => (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const LoginForm: React.FC<Props> = ({
  emailChoices,
  isLoading,
  email,
  password,
  hasError,
  errorMessage,
  hrefLink,
  hasCompany,
  hasFranchisor,
  simplifyUI,
  onOpenIntercomHelp,
  onChangeField,
  onSubmit,
}) => {
  const { t } = useTranslation('login');

  const handleChangeEmailChoice = useCallback(
    (newEmail: string) => onChangeField('email')(newEmail),
    [onChangeField],
  );

  const handleChangeEmail = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChangeField('email')(event.target.value),
    [onChangeField],
  );

  const handleChangePassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChangeField('password')(event.target.value),
    [onChangeField],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(event);
    },
    [onSubmit],
  );

  const signinButtonClass = useMemo(() => {
    let buttonClass = 'bs-login-container__signin-button--default';
    if (simplifyUI) {
      if (hasCompany || hasFranchisor) {
        buttonClass = 'bs-login-container__signin-button--simplifyUI-company';
      } else {
        buttonClass = 'bs-login-container__signin-button--simplifyUI';
      }
    } else if (hasCompany || hasFranchisor) {
      buttonClass = 'bs-login-container__signin-button--company';
    }
    if (isLoading) {
      buttonClass += '--loading';
    }
    return buttonClass;
  }, [hasCompany, hasFranchisor, isLoading, simplifyUI]);

  return (
    <form className="bs-login-container__form" onSubmit={handleSubmit}>
      <div className="bs-login-container__field">
        {emailChoices ? (
          <div id="email-choices">
            <>
              <div
                className={classNames(
                  'bs-login-container__email-choice-label',
                  'bs-login-container__text-body1',
                )}
              >
                {t('signin.selectYourCurrentEmail')}
              </div>
              <div className="bs-login-container__email-choices">
                {emailChoices?.map((email_choice) => {
                  return (
                    <form
                      key={email_choice}
                      className="bs-login-container__row-center"
                    >
                      <Radio
                        labelRight
                        className="bs-login-container__email-choices-radio"
                        disabled={isLoading}
                        isChecked={email === email_choice}
                        label={email_choice}
                        name={email_choice}
                        onClick={handleChangeEmailChoice}
                        value={email_choice}
                      />
                    </form>
                  );
                })}
              </div>
            </>
          </div>
        ) : (
          <TextField
            isFullWidth
            classes={{
              root: 'bs-login-container__text-field',
              label: 'bs-login-container__text-field__label',
              input: 'bs-login-container__text-field__input',
            }}
            id="bs-login-email-container"
            inputId="bs-login-email-input"
            inputTestId="email"
            isDisabled={isLoading}
            label="Email"
            name="login"
            onChange={handleChangeEmail}
            value={email}
            variant="standard"
          />
        )}
      </div>
      <div className="bs-login-container__field">
        <TextField
          isFullWidth
          withPasswordToggle
          classes={{
            root: 'bs-login-container__text-field',
            label: 'bs-login-container__text-field__label',
            input: 'bs-login-container__text-field__input',
          }}
          id="bs-login-password-container"
          inputId="bs-login-password-input"
          inputTestId="password"
          isDisabled={isLoading || (!!emailChoices && !email)}
          label="Password"
          name="bs-login-password"
          onChange={handleChangePassword}
          type="password"
          value={password}
          variant="standard"
        />
      </div>
      {hasError ? (
        <div
          className={classNames(
            'bs-login-container__error-message',
            'bs-login-container__row-center',
          )}
        >
          <div
            className={classNames(
              'bs-login-container__error-text',
              'bs-login-container__text-body2',
            )}
          >
            {errorMessage}
          </div>
          <Button
            classes={{ root: 'bs-login-container__help-intercom-button' }}
            id="btn-intercom-error"
            onClick={onOpenIntercomHelp}
            variant={ButtonVariant.ICON}
          >
            <HelpIcon />
          </Button>
        </div>
      ) : null}
      <Button
        classes={{
          root: classNames(signinButtonClass, {
            'bs-login-container__signin-button--default': !signinButtonClass,
          }),
        }}
        data-testid="btn-signin"
        id="btn-signin"
        isDisabled={isLoading}
        type={ButtonType.SUBMIT}
      >
        {!!isLoading && (
          <CircularProgress
            contrastStrokeColor
            className="bs-login-container__signin-button__circular-progress"
            size="sm"
          />
        )}
        {t('actions.signin')}
      </Button>
      <div
        className={classNames(
          'bs-login-container__row-center',
          'bs-login-container__forgotten-password',
        )}
      >
        <a
          className="bs-login-container__forgotten-password__link"
          href={hrefLink}
        >
          <p
            className={classNames(
              'bs-login-container__forgotten-password__link__text',
              'bs-login-container__text-body2',
            )}
          >
            {t('actions.forgottenPassword')}
          </p>
        </a>
      </div>
    </form>
  );
};

export const LoginFormStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof LoginForm>>()(LoginForm);

export default React.memo(LoginForm);
