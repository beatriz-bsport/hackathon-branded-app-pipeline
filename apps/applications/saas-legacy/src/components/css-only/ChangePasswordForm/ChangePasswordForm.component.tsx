import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import TextField from '#Fabrique/TextField';
import Button, { ButtonColor, ButtonType } from '#Fabrique/Button';
import CircularProgress from '#src/components/css-only/CircularProgress';

import type { CompanyTheme } from '#src/libs/theme/types';
import type { Franchise } from '#src/libs/franchise/types';
import { TextFieldVariant } from '#Fabrique/TextField/types';

import B_ASSET from '../../../public/images/b_dark.jpg';
import './styles.css';

interface FranchiseWithCompany extends Franchise {
  company_theme: CompanyTheme;
  company_name: string;
}

export type Props = {
  companyTheme: CompanyTheme;
  franchisor: FranchiseWithCompany;
  membership?: number;
  franchisorId?: number;
  simplifyUI?: boolean;
  processing?: boolean;
  hasExpired?: boolean;
  password1: string;
  password2: string;
  error?: string;
  requestResetLink: (
    membership: number | null,
    franchisorId: number | null,
  ) => void;
  handlePassword1Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword2Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
};

const ChangePasswordForm: React.FC<Props> = ({
  companyTheme,
  franchisor,
  membership,
  franchisorId,
  simplifyUI,
  processing,
  hasExpired,
  password1,
  password2,
  error,
  handlePassword1Change,
  handlePassword2Change,
  requestResetLink,
  onSubmit,
}) => {
  const { t } = useTranslation(['translation', 'common']);

  const theme = companyTheme || franchisor;

  const handleRequestResetLink = useCallback(
    () => requestResetLink(membership, franchisorId),
    [franchisorId, membership, requestResetLink],
  );

  return (
    <div className="bs-change-password-form__container">
      <div className="bs-change-password-form__logo-container">
        <div className="bs-change-password-form__logo-container__wrapper">
          <img
            alt={`${theme?.company_name || 'bsport'} logo`}
            className="bs-change-password-form__logo-container__wrapper__logo"
            src={theme?.cover || B_ASSET}
          />
        </div>
      </div>
      <div className="bs-change-password-form__content">
        <form className="bs-change-password-form__form" onSubmit={onSubmit}>
          <h1 className="bs-change-password-form__form__title">
            {t('translation:form.login.changePasswordTitle')}
          </h1>
          {!hasExpired && (
            <>
              <TextField
                isFullWidth
                isRequired
                classes={{
                  root: 'bs-change-password-form__form__new-password',
                }}
                id="change-password-new-pasword"
                inputId="change-password-new-pasword-input"
                name="password"
                onChange={handlePassword1Change}
                placeholder={t('translation:form.login.password')}
                type="password"
                value={password1}
                variant={TextFieldVariant.STANDARD}
              />
              <TextField
                isFullWidth
                isRequired
                classes={{
                  root: 'bs-change-password-form__form__new-password-confirm',
                }}
                id="change-password-new-pasword-confirm"
                inputId="change-password-new-pasword-input-confirm"
                name="passwordConfirm"
                onChange={handlePassword2Change}
                placeholder={t('translation:form.login.confirmPassword')}
                type="password"
                value={password2}
                variant={TextFieldVariant.STANDARD}
              />
            </>
          )}
          {error && (
            <div className="bs-change-password-form__form__error">
              <span className="bs-change-password-form__form__error__text">
                {error}
              </span>
            </div>
          )}
          <div className="bs-change-password-form__form__actions">
            {processing && <CircularProgress size="sm" />}
            {!processing && !hasExpired && (
              <Button
                classes={{
                  root: clsx('bs-change-password-form__form__actions__submit', {
                    'bs-change-password-form__form__actions__submit--simplify-ui':
                      simplifyUI,
                  }),
                }}
                color={ButtonColor.PRIMARY}
                id="btn-new-password-confirm"
                type={ButtonType.SUBMIT}
              >
                {t('common:ok')}
              </Button>
            )}
            {hasExpired && (
              <Button
                classes={{
                  root: clsx(
                    'bs-change-password-form__form__actions__reset-again',
                  ),
                }}
                color={ButtonColor.PRIMARY}
                onClick={handleRequestResetLink}
              >
                {t('translation:form.login.resetAgainPassword')}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const ChangePasswordFormStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ChangePasswordForm>>()(
    ChangePasswordForm,
  );

export default React.memo(ChangePasswordForm);
