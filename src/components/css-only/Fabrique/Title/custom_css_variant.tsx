import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { TitleSize } from './constants';
import Title, { Props as TitleProps } from '.';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TitleCss from '!!raw-loader!./styles.css';
import type { CompanyTheme } from '#libs/theme/types';

const fabriqueTextFieldVariationRegistry = [
  {
    label: 'isCollapsable',
    choices: [
      { label: 'Collapsable', value: 'true' },
      { label: 'NotCollapsable', value: 'false' },
    ],
    default: { label: 'Collapsable', value: 'false' },
  },
];

const subtitle = 'Subtitle';
const childrenCollapsable = faker.lorem.sentence();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Pick<TitleProps, 'isCollapsable'> => {
  const isCollapsable = variationsSelected?.isCollapsable?.value === 'true';
  return {
    isCollapsable,
  };
};

export const FABRIQUE_TITLE_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_TITLE,
  css: TitleCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueTextFieldVariationRegistry,
};

export const FABRIQUE_TITLE_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const isCollapsable = usePropsFromVariation(variationsSelected).isCollapsable;
  const baseProps = {
    subtitle,
    childrenCollapsable,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Title
        {...baseProps}
        isCollapsable={isCollapsable}
        title="title-lg"
        variant={TitleSize.LG}
      />
      <Title
        {...baseProps}
        isCollapsable={isCollapsable}
        title="title-md"
        variant={TitleSize.MD}
      />
      <Title
        {...baseProps}
        isCollapsable={isCollapsable}
        title="title-sm"
        variant={TitleSize.SM}
      />
      <Title
        {...baseProps}
        isCollapsable={isCollapsable}
        title="title-xs"
        variant={TitleSize.XS}
      />
    </div>
  );
});
