import type { OptionsType } from 'react-select/lib/types';

import {
  GenerateBarcodesForVariantsEnum,
  ShopItemVariantOption,
} from '#src/libs/shop/components/ShopItemFormReworked/types';

export type ShopItemVariantFormValues = {
  colors: OptionsType<ShopItemVariantOption>;
  sizes: OptionsType<ShopItemVariantOption>;
  generateBarcodesForVariants: `${GenerateBarcodesForVariantsEnum}`;
};
