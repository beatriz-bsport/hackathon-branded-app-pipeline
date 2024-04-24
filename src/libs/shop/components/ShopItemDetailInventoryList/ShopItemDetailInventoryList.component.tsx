import React, { useMemo } from 'react';

import { Formik, FormikHelpers } from 'formik';

import ShopItemInventoryBulkUpdateForm from '#libs/shop/components/ShopItemInventoryBulkUpdateForm';
import ShopItemInventoryUpdateForm from '#libs/shop/components/ShopItemInventoryUpdateForm';

import shopItemInventoryBulkFormValidationSchema from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/shopItemInventoryBulkFormValidationSchema';
import shopItemInventoryFormValidationSchema from '#libs/shop/components/ShopItemInventoryUpdateForm/shopItemInventoryFormValidationSchema';

import type { ShopItemInventoryBulkUpdateFormValues } from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { ShopItemInventoryFormValues } from '#libs/shop/components/ShopItemInventoryUpdateForm/types';
import type { ShopItem, ShopItemVariant } from '#libs/shop/types';

import { ShopItemDetailInventoryFormType } from '#libs/shop/constants';

type Props = {
  formType: `${ShopItemDetailInventoryFormType}`;
  isUpdatingVariant?: boolean;
  shopItem: ShopItem;
  shopItemVariantList: ShopItemVariant[];
  handleSubmit: (
    values: ShopItemInventoryBulkUpdateFormValues | ShopItemInventoryFormValues,
    {
      resetForm,
    }: FormikHelpers<
      ShopItemInventoryBulkUpdateFormValues | ShopItemInventoryFormValues
    >,
  ) => void;
};
const ShopItemDetailInventoryList: React.FC<Props> = ({
  formType,
  isUpdatingVariant,
  shopItemVariantList,
  shopItem,
  handleSubmit,
}) => {
  const validationSchema = {
    [ShopItemDetailInventoryFormType.STANDALONE]:
      shopItemInventoryFormValidationSchema,
    [ShopItemDetailInventoryFormType.VARIANTS]:
      shopItemInventoryBulkFormValidationSchema,
  };

  const initialValues = useMemo(
    () => ({
      [ShopItemDetailInventoryFormType.STANDALONE]: {
        currentStock: shopItem?.current_stock ?? 0,
        stockAdjustment: null,
        totalSales: shopItem?.total_sales ?? 0,
      },
      [ShopItemDetailInventoryFormType.VARIANTS]: {
        variants: (shopItemVariantList ?? []).map((shopItemVariant) => ({
          id: shopItemVariant.id,
          color: shopItemVariant.color,
          size: shopItemVariant.size,
          currentStock: shopItemVariant.current_stock ?? 0,
          stockAdjustment: null,
          totalSales: shopItemVariant.total_sales ?? 0,
        })),
      },
    }),
    [shopItem.current_stock, shopItem.total_sales, shopItemVariantList],
  );

  return (
    <Formik
      enableReinitialize
      validateOnChange
      initialValues={initialValues[formType]}
      onSubmit={handleSubmit}
      validationSchema={validationSchema[formType]}
    >
      <>
        {formType === ShopItemDetailInventoryFormType.STANDALONE && (
          <ShopItemInventoryUpdateForm />
        )}
        {formType === ShopItemDetailInventoryFormType.VARIANTS && (
          <ShopItemInventoryBulkUpdateForm
            isUpdatingVariant={isUpdatingVariant}
          />
        )}
      </>
    </Formik>
  );
};

export default React.memo(ShopItemDetailInventoryList);
