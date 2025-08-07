import React, { useMemo } from 'react';

import { Formik, FormikHelpers } from 'formik';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import ShopItemInventoryBulkUpdateForm from '#src/libs/shop/components/ShopItemInventoryBulkUpdateForm';
import ShopItemInventoryUpdateForm from '#src/libs/shop/components/ShopItemInventoryUpdateForm';

import shopItemInventoryBulkFormValidationSchema from '#src/libs/shop/components/ShopItemInventoryBulkUpdateForm/shopItemInventoryBulkFormValidationSchema';
import shopItemInventoryFormValidationSchema from '#src/libs/shop/components/ShopItemInventoryUpdateForm/shopItemInventoryFormValidationSchema';

import type { ShopItemInventoryBulkUpdateFormValues } from '#src/libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { ShopItemInventoryFormValues } from '#src/libs/shop/components/ShopItemInventoryUpdateForm/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailInventoryFormType } from '#src/libs/shop/constants';

type Props = {
  formType: `${ShopItemDetailInventoryFormType}`;
  isUpdatingVariant?: boolean;
  shopItem: ShopItem;
  shopItemVariantList: ShopItem[];
  variantSizeFilterOptionList: SelectOption[];
  variantSizeFilterOptionValueList: SelectOption[];
  variantColorFilterOptionList: SelectOption[];
  variantColorFilterOptionValueList: SelectOption[];
  establishmentBillingGroupFilterOptionList: SelectOption[];
  variantEstablishmentBillingGroupFilterOptionValue: SelectOption;
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
  changeEstablishmentBillingGroupFilter: (options: SelectOption) => void;
  isMultiLocationWebshopEnabled: boolean;
};

const ShopItemDetailInventoryList: React.FC<Props> = ({
  formType,
  isUpdatingVariant,
  shopItem,
  shopItemVariantList,
  variantSizeFilterOptionList,
  variantSizeFilterOptionValueList,
  variantColorFilterOptionList,
  variantColorFilterOptionValueList,
  establishmentBillingGroupFilterOptionList,
  variantEstablishmentBillingGroupFilterOptionValue,
  handleSubmit,
  changeInventoryVariantFilter,
  changeEstablishmentBillingGroupFilter,
  isMultiLocationWebshopEnabled,
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
        currentStock: shopItem?.current_stock ?? 0,
        stockAdjustment: '',
        totalSales: shopItem?.total_sales ?? 0,
      },
      [ShopItemDetailInventoryFormType.VARIANTS]: {
        variants: (shopItemVariantList ?? []).map((shopItemVariant) => ({
          id: shopItemVariant.id,
          color: shopItemVariant.color,
          size: shopItemVariant.size,
          currentStock: shopItemVariant.current_stock ?? 0,
          stockAdjustment: '',
          totalSales: shopItemVariant.total_sales ?? 0,
        })),
      },
    }),
    [shopItem?.current_stock, shopItem?.total_sales, shopItemVariantList],
  );

  const shouldDisplayEstablishmentBillingGroupFilter =
    establishmentBillingGroupFilterOptionList.length > 0 &&
    isMultiLocationWebshopEnabled;

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
          <>
            {shouldDisplayEstablishmentBillingGroupFilter && (
              <Select
                className={clsx(classes.filterContainer, classes.filterBox)}
                onChange={changeEstablishmentBillingGroupFilter}
                options={establishmentBillingGroupFilterOptionList}
                placeholder={t(
                  'shopItemDetail.table.inventory.filterPlaceholder.establishmentBillingGroup',
                )}
                value={variantEstablishmentBillingGroupFilterOptionValue}
              />
            )}
            <ShopItemInventoryUpdateForm />
          </>
        )}
        {formType === ShopItemDetailInventoryFormType.VARIANTS && (
          <>
            <div className={clsx(classes.flexGap, classes.filterContainer)}>
              {shouldDisplayEstablishmentBillingGroupFilter && (
                <Select
                  className={classes.flexGrow}
                  onChange={changeEstablishmentBillingGroupFilter}
                  options={establishmentBillingGroupFilterOptionList}
                  placeholder={t(
                    'shopItemDetail.table.inventory.filterPlaceholder.establishmentBillingGroup',
                  )}
                  value={variantEstablishmentBillingGroupFilterOptionValue}
                />
              )}
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

            <ShopItemInventoryBulkUpdateForm
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
  filterBox: {
    width: '50%',
  },
}));

export default React.memo(ShopItemDetailInventoryList);
