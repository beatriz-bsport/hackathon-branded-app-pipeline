import React, { ChangeEvent, useCallback, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

import { CompanyTheme } from '#src/libs/theme/types';
// @ts-expect-error
import ChangePasswordFormCss from './styles.css?raw';
import ChangePasswordForm, { Props as ChangePasswordFormProps } from '.';

const ERROR = faker.lorem.words(6);

const resetPasswordFormVariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isChangePasswordLinkExpired',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isError',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];
const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<
  ChangePasswordFormProps,
  | 'franchisorId'
  | 'membership'
  | 'simplifyUI'
  | 'companyTheme'
  | 'password1'
  | 'handlePassword1Change'
  | 'password2'
  | 'handlePassword2Change'
> => {
  const isLoadingSelected = variationsSelected?.loading?.value === 'true';
  const hasExpiredSelected =
    variationsSelected?.isChangePasswordLinkExpired?.value === 'true';
  const isErrorSelected = variationsSelected?.isError?.value === 'true';

  return {
    franchisor: null,
    processing: isLoadingSelected,
    hasExpired: hasExpiredSelected,
    error: isErrorSelected && ERROR,
    requestResetLink: () => {},
    onSubmit: (event) => {
      event.preventDefault();
      return null;
    },
  };
};

export const AUTHENTICATION_CHANGE_PASSWORD_FORM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_CHANGE_PASSWORD_FORM,
    css: ChangePasswordFormCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: resetPasswordFormVariationRegistry,
  };

export const AUTHENTICATION_CHANGE_PASSWORD_FORM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const { t } = useTranslation('widget');

  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const updatePassword1 = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword1(event.target.value);
    },
    [],
  );

  const updatePassword2 = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword2(event.target.value);
    },
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.authenticationTextField', {
          component_name: t('widget.components.authentication_textfield'),
          page: t('widget.page.authentication'),
        })}
      </Alert>
      <ChangePasswordForm
        {...componentProps}
        simplifyUI
        companyTheme={theme}
        handlePassword1Change={updatePassword1}
        handlePassword2Change={updatePassword2}
        password1={password1}
        password2={password2}
      />
    </div>
  );
});
