import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import StatusMessageWithIcon from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import StatusMessageWithIconCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

const VariationRegistry = [
  {
    label: 'loading',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: {
      label: 'false',
      value: 'false',
    },
  },

  {
    label: 'messageWithActions',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: {
      label: 'true',
      value: 'true',
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): React.ComponentProps<typeof StatusMessageWithIcon> => {
  const isLoading = variationsSelected?.loading?.value === 'true';

  const withActions = variationsSelected?.messageWithActions?.value === 'true';

  const message = faker.lorem.sentence(20);
  const title = faker.lorem.sentence(10);

  const actions = {
    confirm: {
      label: faker.lorem.word(5),
      onClick: () => {},
    },
    cancel: {
      label: faker.lorem.word(5),
      onClick: () => {},
    },
  };
  return {
    message,
    ...(withActions ? { actions } : {}),
    isLoading,
    title,
  };
};

export const MESSAGE_WITH_ICON_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.MESSAGE_WITHOUT_ICON,
  css: StatusMessageWithIconCss,
  pages: [MarketplacePage.COMMON],
  defaultState: {},
  variations: VariationRegistry,
};

export const MESSAGE_WITH_ICON_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <StatusMessageWithIcon {...componentProps} />;
});
