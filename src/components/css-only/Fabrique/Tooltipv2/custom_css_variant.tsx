import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#libs/exportable-components/types';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TooltipCSS from '!!raw-loader!./styles.css';

import type { CompanyTheme } from '#libs/theme/types';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import Typography from '#Fabrique/Typography';
import Tooltip from '.';
import { colorEnum } from './constants';

type TooltipProps = React.ComponentProps<typeof Tooltip>;

const fabriqueTooltipVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: colorEnum.WEAK, value: colorEnum.WEAK },
      { label: colorEnum.STRONG, value: colorEnum.STRONG },
    ],
    default: { label: colorEnum.WEAK, value: colorEnum.WEAK },
  },
];

export const FABRIQUE_TOOLTIP_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_TOOLTIP,
  pages: [MarketplacePage.FABRIQUE],
  showAsFlex: true,
  defaultState: {},
  variations: fabriqueTooltipVariationRegistry,
  css: TooltipCSS,
};

const usePropsFromVariation = (
  variationSelected: Record<string, VariationConfigurationChoice>,
): Pick<TooltipProps, 'color'> => {
  return {
    color: variationSelected?.color?.value as colorEnum,
  };
};

export const FABRIQUE_TOOLTIP_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };

  const { t } = useTranslation('widget');
  return (
    <Tooltip id="tooltip" text="Tooltip" {...componentProps}>
      <ButtonBase
        aria-haspopup="true"
        style={{ border: '2px solid black', padding: '16px' }}
      >
        <Typography variant="body-lg">
          {t('widget:widget.customCss.tooltipHover')}
        </Typography>
      </ButtonBase>
    </Tooltip>
  );
});
