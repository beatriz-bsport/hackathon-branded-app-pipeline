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
  color: string;
  size: string;
  price?: number;
  variantCount?: number;
}) => {
  if (!name) return '';

  // base item
  if (variantCount) {
    return [name, variantCount, price].filter((text) => !!text).join(' - ');
  }

  // standalone/variant item
  return [name, color, size].filter((text) => !!text).join(' - ');
};
