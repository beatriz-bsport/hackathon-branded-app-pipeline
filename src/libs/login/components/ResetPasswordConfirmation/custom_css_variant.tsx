import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import ResetPasswordConfirmation from '.';
// @ts-expect-error
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
