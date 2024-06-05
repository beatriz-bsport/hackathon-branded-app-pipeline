import React, { useMemo } from 'react';
import * as Yup from 'yup';

import { Formik, FormikHelpers } from 'formik';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import FranchiseShopItemTemplateDetailInventoryBulkUpdateForm from '#src/libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm.component';
import ShopItemInventoryUpdateForm from '#src/libs/shop/components/ShopItemInventoryUpdateForm';

import type { ShopItemInventoryBulkUpdateFormValues } from '#src/libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { ShopItemInventoryFormValues } from '#src/libs/shop/components/ShopItemInventoryUpdateForm/types';
import type { ShopItem, ShopItemTemplate } from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailInventoryFormType } from '#src/libs/shop/constants';

const shopItemInventoryBulkFormValidationSchema = Yup.object().shape({
  variants: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(false),
      color: Yup.string().nullable(true),
      size: Yup.string().nullable(true),
      currentStock: Yup.number(),
      companyName: Yup.string(),
      stockAdjustment: Yup.number().nullable(true),
      totalSales: Yup.number(),
    }),
  ),
});

const shopItemInventoryFormValidationSchema = Yup.object().shape({
  currentStock: Yup.number(),
  stockAdjustment: Yup.number().required(),
  totalSales: Yup.number(),
});

type Props = {
  formType: `${ShopItemDetailInventoryFormType}`;
  isUpdatingVariant?: boolean;
  shopItemTemplate: ShopItemTemplate;
  shopItemTemplateInstanceList: ShopItem[];
  variantSizeFilterOptionList: SelectOption[];
  variantSizeFilterOptionValueList: SelectOption[];
  variantColorFilterOptionList: SelectOption[];
  variantColorFilterOptionValueList: SelectOption[];
  handleSubmit: (
    values: ShopItemInventoryBulkUpdateFormValues | ShopItemInventoryFormValues,
    {
      resetForm,
    }: FormikHelpers<
      ShopItemInventoryBulkUpdateFormValues | ShopItemInventoryFormValues
    >,
  ) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes',
  ) => (options: SelectOption[]) => void;
};

const FranchiseShopItemTemplateDetailInventoryList: React.FC<Props> = ({
  formType,
  isUpdatingVariant,
  shopItemTemplate,
  shopItemTemplateInstanceList,
  variantSizeFilterOptionList,
  variantSizeFilterOptionValueList,
  variantColorFilterOptionList,
  variantColorFilterOptionValueList,
  handleSubmit,
  changeInventoryVariantFilter,
}) => {
  const { t } = useTranslation('shop');
  const classes = useStyles();

  const validationSchema = {
    [ShopItemDetailInventoryFormType.STANDALONE]:
      shopItemInventoryFormValidationSchema,
    [ShopItemDetailInventoryFormType.VARIANTS]:
      shopItemInventoryBulkFormValidationSchema,
  };

  const initialValues = useMemo(
    () => ({
      instances: (shopItemTemplateInstanceList ?? []).map((shopItem) => ({
        id: shopItem.id,
        color: shopItem.color,
        size: shopItem.size,
        currentStock: shopItem.current_stock ?? 0,
        companyName: shopItem.company_details?.name,
        stockAdjustment: '',
        totalSales: shopItemTemplate?.total_sales ?? 0,
      })),
    }),
    [shopItemTemplate?.total_sales, shopItemTemplateInstanceList],
  );

  return (
    <Formik
      enableReinitialize
      validateOnChange
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema[formType]}
    >
      <>
        {formType === ShopItemDetailInventoryFormType.STANDALONE && (
          <ShopItemInventoryUpdateForm />
        )}
        {formType === ShopItemDetailInventoryFormType.VARIANTS && (
          <>
            <div
              className={classNames(classes.flexGap, classes.filterContainer)}
            >
              <Select
                isClearable
                isMulti
                className={classes.flexGrow}
                onChange={changeInventoryVariantFilter('sizes')}
                options={variantSizeFilterOptionList}
                placeholder={t(
                  'shopItemDetail.table.inventory.filterPlaceholder.size',
                )}
                value={variantSizeFilterOptionValueList}
              />
              <Select
                isClearable
                isMulti
                className={classes.flexGrow}
                onChange={changeInventoryVariantFilter('colors')}
                options={variantColorFilterOptionList}
                placeholder={t(
                  'shopItemDetail.table.inventory.filterPlaceholder.color',
                )}
                value={variantColorFilterOptionValueList}
              />
            </div>

            <FranchiseShopItemTemplateDetailInventoryBulkUpdateForm
              isUpdatingVariant={isUpdatingVariant}
            />
          </>
        )}
      </>
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    marginBottom: theme.spacing(2),
  },
  flexGap: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  flexGrow: {
    flex: 1,
  },
}));

export default React.memo(FranchiseShopItemTemplateDetailInventoryList);
