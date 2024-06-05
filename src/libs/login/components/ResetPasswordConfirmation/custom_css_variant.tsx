import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';
import ResetPasswordConfirmation from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ResetPasswordConfirmationCss from './styles.css?raw';

const voidFunction = () => {};

export const RESET_PASSWORD_CONFIRMATION_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.RESET_PASSWORD_CONFIRMATION,
    css: ResetPasswordConfirmationCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: [],
  };

export const RESET_PASSWORD_CONFIRMATION_PREVIEW: React.FC = React.memo(() => {
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
      <ResetPasswordConfirmation handlePageExit={voidFunction} />
    </div>
  );
});
