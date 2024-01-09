import React, { useCallback, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import LoginForm, { Props as LoginFormProps } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import LoginFormCss from '!!raw-loader!./styles.css';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { CompanyTheme } from '#libs/theme/types';

const loginFormVariationRegistry = [
  {
    label: 'hasEmailChoices',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'loading',
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
  theme: CompanyTheme,
): Omit<LoginFormProps, 'email' | 'password' | 'onChangeField'> => {
  const hasEmailChoicesSelected =
    variationsSelected?.hasEmailChoices?.value === 'true';
  const isLoadingSelected = variationsSelected?.loading?.value === 'true';
  const isErrorSelected = variationsSelected?.isError?.value === 'true';

  return {
    emailChoices: hasEmailChoicesSelected
      ? faker.helpers.multiple(() => faker.internet.email(), {
          count: 3,
        })
      : null,
    isLoading: isLoadingSelected,
    hasError: isErrorSelected,
    errorMessage: faker.lorem.sentence(),
    hrefLink: null,
    hasCompany: !!theme.company,
    simplifyUI:
      theme?.display_new_checkout_flow || !theme?.display_bubble_background,
    onOpenIntercomHelp: () => {},
    onSubmit: () => {},
  };
};

export const AUTHENTICATION_LOGIN_FORM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_LOGIN_FORM,
    css: LoginFormCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: loginFormVariationRegistry,
  };

export const AUTHENTICATION_LOGIN_FORM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const { t } = useTranslation('widget');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const componentProps = {
    ...usePropsFromVariation(variationsSelected, theme),
  };

  const handleChangeField = useCallback(
    (id: 'email' | 'password') => (value: string) => {
      if (id === 'email') {
        setEmail(value);
      } else if (id === 'password') {
        setPassword(value);
      }
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
      <LoginForm
        {...componentProps}
        email={email}
        onChangeField={handleChangeField}
        password={password}
      />
    </div>
  );
});
