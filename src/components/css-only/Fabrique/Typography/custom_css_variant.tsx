import React from 'react';

import Typography, { Props as TypographyProps } from '.';
import { TypographyVariant, TypographyColor } from './constants';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TypographyCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import type { CompanyTheme } from '#libs/theme/types';
import type { TypographyColorType } from './types';

const fabriqueTextFieldVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: TypographyColor.DEFAULT, value: TypographyColor.DEFAULT },
      { label: TypographyColor.ERROR, value: TypographyColor.ERROR },
    ],
    default: { label: TypographyColor.DEFAULT, value: TypographyColor.DEFAULT },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Pick<TypographyProps, 'color'> => {
  const color = variationsSelected?.color?.value as TypographyColorType;
  return {
    color,
  };
};

export const FABRIQUE_TYPOGRAPHY_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_TYPOGRAPHY,
    css: TypographyCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueTextFieldVariationRegistry,
  };

export const FABRIQUE_TYPOGRAPHY_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const color = usePropsFromVariation(variationsSelected).color;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        color={color}
        variant={TypographyVariant.DISPLAY_LG}
      >{`${TypographyVariant.DISPLAY_LG}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.DISPLAY_MD}
      >{`${TypographyVariant.DISPLAY_MD}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.DISPLAY_SM}
      >{`${TypographyVariant.DISPLAY_SM}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.TITLE_LG}
      >{`${TypographyVariant.TITLE_LG}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.TITLE_MD}
      >{`${TypographyVariant.TITLE_MD}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.TITLE_SM}
      >{`${TypographyVariant.TITLE_SM}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.BODY_LG}
      >{`${TypographyVariant.BODY_LG}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.BODY_MD}
      >{`${TypographyVariant.BODY_MD}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.BODY_SM}
      >{`${TypographyVariant.BODY_SM}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.BODY_XS}
      >{`${TypographyVariant.BODY_XS}`}</Typography>
      <Typography
        color={color}
        variant={TypographyVariant.BODY_2XS}
      >{`${TypographyVariant.BODY_2XS}`}</Typography>
    </div>
  );
});
