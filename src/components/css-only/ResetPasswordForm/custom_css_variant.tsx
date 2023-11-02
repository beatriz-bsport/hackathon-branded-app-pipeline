import React, { useCallback, useState } from 'react';

import ResetPasswordForm, { Props as ResetPasswordFormProps } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ResetPasswordFormCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { CompanyTheme } from '#libs/theme/types';

const resetPasswordFormVariationRegistry = [
  {
    label: 'isError',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'hasSent',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];
const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<ResetPasswordFormProps, 'email' | 'updateEmail'> => {
  const hasResetErrorSelected = variationsSelected?.isError?.value === 'true';
  const hasSentSelected = variationsSelected?.hasSent?.value === 'true';

  return {
    hasSent: hasSentSelected,
    hasResetError: hasResetErrorSelected,
    last_password_reset_request: '',
    redirectUrlWithParams: '#',
    redirectLogin: () => {},
    onSubmit: () => {},
  };
};

export const AUTHENTICATION_RESET_PASSWORD_FORM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_RESET_PASSWORD_FORM,
    css: ResetPasswordFormCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: resetPasswordFormVariationRegistry,
  };

export const AUTHENTICATION_RESET_PASSWORD_FORM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const [email, setEmail] = useState('');
  const componentProps = { ...usePropsFromVariation(variationsSelected) };

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setEmail(event.target.value),
    [],
  );

  return (
    <div style={{ flex: 1 }}>
      <ResetPasswordForm
        {...componentProps}
        email={email}
        updateEmail={handleOnChange}
      />
    </div>
  );
});
