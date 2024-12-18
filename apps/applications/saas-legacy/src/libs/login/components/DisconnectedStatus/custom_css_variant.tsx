import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

import DisconnectedStatus from '.';

// @ts-expect-error
import DisconnectedStatusCss from './styles.css?raw';

const disconnectedStatusVariationRegistry = [
  {
    label: 'showTitle',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'showSubtitle',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): { showTitle: boolean; showSubtitle: boolean } => {
  const showTitle = variationsSelected?.showTitle?.value === 'true';
  const showSubtitle = variationsSelected?.showSubtitle?.value === 'true';

  return { showSubtitle, showTitle };
};

export const AUTHENTICATION_DISCONNECTED_STATUS_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.AUTHENTICATION_DISCONNECTED_STATUS,
    css: DisconnectedStatusCss,
    pages: [MarketplacePage.AUTHENTICATION],
    defaultState: {},
    variations: disconnectedStatusVariationRegistry,
  };

export const AUTHENTICATION_DISCONNECTED_STATUS_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const propsFromVariation = usePropsFromVariation(variationsSelected);

  const emptyFn = React.useCallback(() => {}, []);
  return (
    <DisconnectedStatus
      {...propsFromVariation}
      loginSubtitle=""
      loginTitle=""
      onLoginClick={emptyFn}
      onSignupClick={emptyFn}
    />
  );
});
