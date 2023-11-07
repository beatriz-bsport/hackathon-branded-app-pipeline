import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import Login, { Props as LoginProps } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import LoginCss from '!!raw-loader!./styles.css';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { CompanyTheme } from '#libs/theme/types';

const loginVariationRegistry = [
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
): Omit<LoginProps, 'i18n' | 'tReady' | 't'> => {
  const hasEmailChoicesSelected =
    variationsSelected?.hasEmailChoices?.value === 'true';
  const isLoadingSelected = variationsSelected?.loading?.value === 'true';
  const isErrorSelected = variationsSelected?.isError?.value === 'true';

  return {
    doEmailLogin: () => {},
    requestSignUp: () => {},
    loading: isLoadingSelected,
    classes: null,
    error: isErrorSelected,
    errorFields: {
      email: undefined,
      password: undefined,
    },
    simplifyUI:
      theme?.display_new_checkout_flow || !theme?.display_bubble_background,
    isPremium: theme.is_premium,
    company: !!theme.company,
    theme,
    logoHidden: false,
    marketplace: false,
    franchisor: undefined,
    hideRegister: false,
    emailChoices: hasEmailChoicesSelected
      ? faker.helpers.multiple(() => faker.internet.email(), {
          count: 3,
        })
      : null,
  };
};

export const AUTHENTICATION_LOGIN_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_LOGIN,
    css: LoginCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: loginVariationRegistry,
  };

export const AUTHENTICATION_LOGIN_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = {
    ...usePropsFromVariation(variationsSelected, theme),
  };

  return (
    <div style={{ flex: 1 }}>
      <Login {...componentProps} />
    </div>
  );
});
