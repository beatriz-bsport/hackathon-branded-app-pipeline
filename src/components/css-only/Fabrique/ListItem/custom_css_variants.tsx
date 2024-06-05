import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { ArrowBlockLeft } from '#components/untitledui';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ListItemCSS from './styles.css?raw';

import { ListItem } from './ListItem.component';
import { ListItemSizeEnum, ListItemTypeEnum } from './constants';
import type { ListItemSize, ListItemType } from './types';

const fabriqueListItemVariationRegistry = [
  {
    label: 'size',
    choices: [
      { label: ListItemSizeEnum.SM, value: ListItemSizeEnum.SM },
      { label: ListItemSizeEnum.LG, value: ListItemSizeEnum.LG },
    ],
    default: { label: ListItemSizeEnum.LG, value: ListItemSizeEnum.LG },
  },
  {
    label: 'displayIcon',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'type',
    choices: [
      { label: ListItemTypeEnum.CHECKBOX, value: ListItemTypeEnum.CHECKBOX },
      { label: ListItemTypeEnum.RADIO, value: ListItemTypeEnum.RADIO },
      { label: ListItemTypeEnum.TEXT, value: ListItemTypeEnum.TEXT },
      {
        label: ListItemTypeEnum.CLICKABLETEXT,
        value: ListItemTypeEnum.CLICKABLETEXT,
      },
    ],
    default: { label: ListItemTypeEnum.TEXT, value: ListItemTypeEnum.TEXT },
  },
  {
    label: 'isDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isSelectable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayCaptionText',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayLabel',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isRippleEnabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
) => {
  const displayIcon = variationsSelected?.displayIcon?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const size = variationsSelected?.size?.value as ListItemSize;
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const isRippleEnabled = variationsSelected?.isRippleEnabled?.value === 'true';
  const type = variationsSelected?.type?.value as ListItemType;
  return {
    size,
    isDisabled,
    icon: displayIcon && <ArrowBlockLeft />,
    captionText: displayCaptionText && 'Caption text',
    label: displayLabel && 'Label',
    isRippleEnabled,
    type,
  };
};

export const FABRIQUE_LIST_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_LIST_ITEM,
  css: ListItemCSS,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueListItemVariationRegistry,
};

export const FABRIQUE_LIST_ITEM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const isSelectable = variationsSelected?.isSelectable?.value === 'true';
  const [isSelected, setIsSelected] = React.useState(false);

  return (
    <ListItem
      isSelected={isSelectable && isSelected}
      {...componentProps}
      onClick={
        isSelectable
          ? () => {
              setIsSelected(!isSelected);
            }
          : null
      }
    />
  );
});
