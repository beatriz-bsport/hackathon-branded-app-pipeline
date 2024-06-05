import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
// @ts-expect-error
import ItenQuantityCss from './styles.css?raw';
import ItemQuantity, { Props } from '.';

const marketplaceItemQuantityVariationRegistry = [
  {
    label: 'isAddingItemPossible',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isItemEditionDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  itemQuantity: number,
  onAddOneItem: () => void,
  onRemoveOneItem: () => void,
): Props => {
  const isAddingItemPossible =
    variationsSelected?.isAddingItemPossible?.value === 'true';
  const isItemEditionDisabled =
    variationsSelected?.isItemEditionDisabled?.value === 'true';

  return {
    isAddingItemPossible,
    isItemEditionDisabled,
    itemQuantity,
    onAddOneItem,
    onRemoveOneItem,
  };
};

export const MARKETPLACE_ITEM_QUANTITY_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_ITEM_QUANTITY,
    css: ItenQuantityCss,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplaceItemQuantityVariationRegistry,
  };

export const MARKETPLACE_ITEM_QUANTITY_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const [itemQuantity, setItemQuantity] = React.useState(1);

  const onAddOneItem = () =>
    setItemQuantity((prevItemQuantity) => prevItemQuantity + 1);

  const onRemoveOneItem = () =>
    setItemQuantity((prevItemQuantity) => Math.max(prevItemQuantity - 1, 1));

  const componentProps = usePropsFromVariation(
    variationsSelected,
    itemQuantity,
    onAddOneItem,
    onRemoveOneItem,
  );
  return <ItemQuantity {...componentProps} />;
});
