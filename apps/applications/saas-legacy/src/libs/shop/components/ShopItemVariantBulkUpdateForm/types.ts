export type ShopItemVariantBulkUpdateFormRow = {
  id: number;
  /**
   * A variant cover is:
   * - `string` if an image is already stored in DB
   * - `null` if nothing has been uploaded
   * - `File` if we did upload an image in the Formik Form
   */
  cover: string | null | File;
  color: string;
  size: string;
  price: number;
  supplierPrice: number;
  stockKeepingUnit: string;
  barcode: string;
  marketplaceEnabled: boolean;
};

export type ShopItemVariantBulkUpdateFormValues = {
  variants: ShopItemVariantBulkUpdateFormRow[];
};
