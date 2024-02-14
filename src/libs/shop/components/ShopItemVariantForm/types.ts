import type { OptionsType } from 'react-select/lib/types';
import type { ShopItemVariantOption } from '../ShopItemFormReworked/types';

export type ShopItemVariantFormValues = {
  colors: OptionsType<ShopItemVariantOption>;
  sizes: OptionsType<ShopItemVariantOption>;
};
