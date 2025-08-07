import React, { useMemo } from 'react';

import { Formik, FormikHelpers } from 'formik';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import FranchiseShopItemTemplateDetailInventoryBulkUpdateForm from '#src/libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm';
import franchiseShopItemTemplateDetailInventoryBulkUpdateFormValidationSchema from '#src/libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm/validationSchema';

import type { ShopItemTemplateInventoryBulkUpdateFormValues } from '#src/libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm/types';
import type { ShopItem, ShopItemTemplate } from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';

type Props = {
  isUpdatingVariant?: boolean;
  shopItemTemplate: ShopItemTemplate;
  shopItemTemplateInstanceList: ShopItem[];
  variantSizeFilterOptionList: SelectOption[];
  variantSizeFilterOptionValueList: SelectOption[];
  variantColorFilterOptionList: SelectOption[];
  variantColorFilterOptionValueList: SelectOption[];
  variantCompanyFilterOptionList: SelectOption[];
  variantCompanyFilterOptionValueList: SelectOption[];
  showVariantFilters?: boolean;
  handleSubmit: (
    values: ShopItemTemplateInventoryBulkUpdateFormValues,
    { resetForm }: FormikHelpers<ShopItemTemplateInventoryBulkUpdateFormValues>,
  ) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes' | 'company',
  ) => (options: SelectOption[]) => void;
};

const FranchiseShopItemTemplateDetailInventoryList: React.FC<Props> = ({
  isUpdatingVariant,
  shopItemTemplate,
  shopItemTemplateInstanceList,
  variantSizeFilterOptionList,
  variantSizeFilterOptionValueList,
  variantColorFilterOptionList,
  variantColorFilterOptionValueList,
  variantCompanyFilterOptionList,
  variantCompanyFilterOptionValueList,
  showVariantFilters,
  handleSubmit,
  changeInventoryVariantFilter,
}) => {
  const { t } = useTranslation('shop');
  const classes = useStyles();

  const initialValues = useMemo(
    () => ({
      instances: (shopItemTemplateInstanceList ?? []).map((shopItem) => ({
        id: shopItem.id,
        color: shopItem.color,
        size: shopItem.size,
        currentStock: shopItem.current_stock ?? 0,
        companyName: shopItem.company_details?.name,
        isMultiLocationWebshopEnabled:
          !!shopItem.company_details?.is_multi_location_webshop_enabled,
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
      validationSchema={
        franchiseShopItemTemplateDetailInventoryBulkUpdateFormValidationSchema
      }
    >
      <>
        <div className={clsx(classes.flexGap, classes.filterContainer)}>
          <Select
            isClearable
            isMulti
            className={classes.flexGrow}
            onChange={changeInventoryVariantFilter('company')}
            options={variantCompanyFilterOptionList}
            placeholder={t(
              'shopItemDetail.table.inventory.filterPlaceholder.company',
            )}
            value={variantCompanyFilterOptionValueList}
          />
          {showVariantFilters && (
            <>
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
            </>
          )}
        </div>

        <FranchiseShopItemTemplateDetailInventoryBulkUpdateForm
          isUpdatingVariant={isUpdatingVariant}
          showVariantColumn={shopItemTemplate?.number_of_variants > 0}
        />
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
