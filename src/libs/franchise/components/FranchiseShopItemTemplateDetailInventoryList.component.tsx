import React, { useMemo } from 'react';
import * as Yup from 'yup';

import { Formik, FormikHelpers } from 'formik';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import FranchiseShopItemTemplateDetailInventoryBulkUpdateForm from '#libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm.component';
import ShopItemInventoryUpdateForm from '#libs/shop/components/ShopItemInventoryUpdateForm';

import type { ShopItemInventoryBulkUpdateFormValues } from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { ShopItemInventoryFormValues } from '#libs/shop/components/ShopItemInventoryUpdateForm/types';
import type { ShopItem, ShopItemTemplate } from '#libs/shop/types';
import type { SelectOption } from '#libs/types';

import { ShopItemDetailInventoryFormType } from '#libs/shop/constants';

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
  shopItemVariantList: ShopItem[];
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
  shopItemVariantList,
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
      [ShopItemDetailInventoryFormType.STANDALONE]: {
        currentStock: shopItemTemplate?.current_stock ?? 0,
        stockAdjustment: '',
        totalSales: shopItemTemplate?.total_sales ?? 0,
      },
      [ShopItemDetailInventoryFormType.VARIANTS]: {
        variants: (shopItemVariantList ?? []).map((shopItemVariant) => ({
          id: shopItemVariant.id,
          color: shopItemVariant.color,
          size: shopItemVariant.size,
          currentStock: shopItemVariant.current_stock ?? 0,
          companyName: shopItemVariant.company_details.name,
          stockAdjustment: '',
          totalSales: shopItemVariant.total_sales ?? 0,
        })),
      },
    }),
    [
      shopItemTemplate?.current_stock,
      shopItemTemplate?.total_sales,
      shopItemVariantList,
    ],
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
