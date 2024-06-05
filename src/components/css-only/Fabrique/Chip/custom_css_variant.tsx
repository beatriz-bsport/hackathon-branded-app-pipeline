import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { Star06 } from '#src/components/untitledui';
import Chip, { Props as ChipProps } from '.';
import { ChipColorEnum, ChipSizeEnum, ChipVariantEnum } from './constants';
// @ts-expect-error
import ChipCss from './styles.css?raw';

const CHIP_TEXT = faker.lorem.word(8);

const fabriqueChipVariationRegistry = [
  {
    label: 'fabriqueVariant',
    choices: [
      { label: ChipVariantEnum.STRONG, value: ChipVariantEnum.STRONG },
      { label: ChipVariantEnum.WEAK, value: ChipVariantEnum.WEAK },
    ],
    default: { label: ChipVariantEnum.STRONG, value: ChipVariantEnum.STRONG },
  },
  {
    label: 'size',
    choices: [
      { label: ChipSizeEnum.SM, value: ChipSizeEnum.SM },
      { label: ChipSizeEnum.LG, value: ChipSizeEnum.LG },
    ],
    default: { label: ChipSizeEnum.LG, value: ChipSizeEnum.LG },
  },
  {
    label: 'color',
    choices: [
      { label: ChipColorEnum.MAIN, value: ChipColorEnum.MAIN },
      { label: ChipColorEnum.GREY, value: ChipColorEnum.GREY },
      { label: ChipColorEnum.INFO, value: ChipColorEnum.INFO },
      { label: ChipColorEnum.SUCCESS, value: ChipColorEnum.SUCCESS },
      { label: ChipColorEnum.WARNING, value: ChipColorEnum.WARNING },
      { label: ChipColorEnum.ERROR, value: ChipColorEnum.ERROR },
    ],
    default: { label: ChipColorEnum.MAIN, value: ChipColorEnum.MAIN },
  },
  {
    label: 'displayLeftIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<ChipProps, 'children'> => {
  const displayLeftIconSelected =
    variationsSelected?.displayLeftIcon?.value === 'true';
  const disabledSelected = variationsSelected?.isDisabled?.value === 'true';
  const chipVariantSelected = variationsSelected?.fabriqueVariant
    ?.value as ChipVariantEnum;
  const chipSizeSelected = variationsSelected?.size?.value as ChipSizeEnum;
  const chipColorSelected = variationsSelected?.color?.value as ChipColorEnum;

  return {
    variant: chipVariantSelected,
    size: chipSizeSelected,
    color: chipColorSelected,
    isDisabled: disabledSelected,
    leftIcon: displayLeftIconSelected && <Star06 stroke="currentColor" />,
    onClose: () => {},
  };
};

export const FABRIQUE_CHIP_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_CHIP,
  css: ChipCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueChipVariationRegistry,
};

export const FABRIQUE_CHIP_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Chip {...componentProps}>{CHIP_TEXT}</Chip>
    </div>
  );
});
