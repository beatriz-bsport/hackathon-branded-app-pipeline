import type { ShopItemVariantCombination } from './types';

type ShopItemVariantComputedCombination = { color: string; size: string };

/**
 * Retrieves the complete naming of a shop item\
 * Adds color/size to the item name if its a variant
 *
 * @param name The name field from the shop item
 * @param color The color field from the shop item -- might be an empty string
 * @param size The size field from the shop item -- might be an empty string
 * @param price The product price or variant lowest variant price
 * @param variantCount The number of existing variant (for a base item)
 *
 * @example
 * const name = shopItem.name;
 * const color = shopItem.color;
 * const size = shopItem.size;
 * const price = getCurrencyDisplayWithPrice(shopItem.price);
 * const variantCount = shopItem.variantCount && t('variantCount', {count: shopItem.variantCount});
 *
 * const shopItemBaseName = getShopItemName({ name, price, variantCount });
 * // Boxing gloves - 5 variants - $50
 *
 * const shopItemVariantName = getShopItemName({ name, color, size, price });
 * // Boxing gloves - Black/White - XL - $50
 *
 * const shopItemStandaloneName = getShopItemName({ name, price });
 * // Boxing gloves - $50
 */
export const getShopItemName = ({
  name,
  color,
  size,
  price,
  variantCount,
}: {
  name: string;
  color?: string;
  size?: string;
  price?: number;
  variantCount?: string;
}) => {
  if (!name) return '';

  // base item
  if (variantCount) {
    return [name, variantCount, price].filter((text) => !!text).join(' - ');
  }

  // standalone/variant item
  return [name, color, size, price].filter((text) => !!text).join(' - ');
};

/**
 * Returns an array of every variant combination that will be created from provided colors and sizes
 * @param colors An array of string representing all colors
 * @param sizes An array of string representing all sizes
 * @example
 * const shopItemColorSizeCombinationList = generateRecursiveItems(['white', 'red'], ['s', 'm'])
 * /*
 * [
 *   { color: 'white', size: 's' },
 *   { color: 'white', size: 'm' },
 *   { color: 'red', size: 's' },
 *   { color: 'red', size: 'm' }
 * ]
 */
export const generateShopitemColorSizeCombinationList = (
  colors: string[],
  sizes: string[],
) => {
  const colorSizeCombinationList = (colors ?? []).reduce<
    { color: string; size: string }[]
  >((acc, color) => {
    /**
     * For each color entered, we want sizes combinations
     * @example ['red', 'blue'] with ['S', 'M'] => [{ color: 'red', size: 'S' }, ...]
     */
    const associatedSizeValuesFromColor = (sizes ?? []).map((size) => ({
      color,
      size,
    }));
    return [...acc, ...associatedSizeValuesFromColor];
  }, []);

  const colorsCombinationList = (sizes ?? []).length
    ? []
    : (colors ?? []).map((color) => ({ color, size: '' }));

  const sizesCombinationList = (colors ?? []).length
    ? []
    : (sizes ?? []).map((size) => ({ color: '', size }));

  return [
    ...colorSizeCombinationList, // combinations when colors + sizes are provided
    ...colorsCombinationList, // combinations when colors only are provided
    ...sizesCombinationList, // combinations when sizes only are provided
  ];
};

/**
 * Returns any duplicated variantcombination from existing combination list
 * @param combinationList A list of color and size options from Formik
 * @param existingCombinationList The list of existing combination list for a base item
 * @example
 * const duplicatedCombinationList = getDuplicateVariantCombinationList([{ color: 'red' }], [{ color: 'white' }, { color: 'red' }])
 * // [{ color: 'red' }]
 */
export const getDuplicateVariantCombinationList = (
  combinationList: ShopItemVariantComputedCombination[],
  existingCombinationList: ShopItemVariantCombination[],
) => {
  return (combinationList ?? []).reduce<ShopItemVariantComputedCombination[]>(
    (acc, combination) => {
      const isDuplicated = (existingCombinationList ?? []).some(
        (existingCombination) =>
          existingCombination.color === combination.color &&
          existingCombination.size === combination.size,
      );
      return isDuplicated ? [...acc, combination] : acc;
    },
    [],
  );
};
