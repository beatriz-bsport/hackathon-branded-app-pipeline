import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import type {
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItem,
  ShopItemTemplate,
} from '#src/libs/shop/types';
import type { ShopItemTemplateInventoryBulkUpdateFormValues } from '#src/libs/franchise/components/FranchiseShopItemTemplateDetailInventoryBulkUpdateForm/types';
import type { OptionCallback } from '#src/state/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';
import {
  SHOP_ITEM_VARIANTS_PAGE_SIZE,
  ShopItemDetailInventoryFormType,
} from '#src/libs/shop/constants';
import FranchiseShopItemDetailInventoryListMobile from './FranchiseShopItemDetailInventoryListMobile.component';
import FranchiseShopItemTemplateDetailInventoryList from './FranchiseShopItemTemplateDetailInventoryList.component';

type Props = {
  shopItemTemplateInstanceList: ShopItem[];
  page: number;
  count: number;
  isUpdatingVariant?: boolean;
  isStandaloneItem?: boolean;
  shopItemTemplate: ShopItemTemplate;
  shopItemVariantFilterOptionList: {
    colors: SelectOption[];
    sizes: SelectOption[];
    company: SelectOption[];
  };
  shopItemVariantFilterOptionValues: {
    colors: SelectOption[];
    sizes: SelectOption[];
    company: SelectOption[];
  };
  variantCombinationListCount: number;
  handleOpenVariantDrawer: () => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  setQueryParam: (queryParam: string) => (value: string) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes' | 'company',
  ) => (options: SelectOption[]) => void;
};

const FranchiseShopItemTemplateDetailInventoryTab: React.FC<Props> = ({
  shopItemTemplateInstanceList,
  page,
  count,
  isUpdatingVariant,
  isStandaloneItem,
  shopItemTemplate,
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  variantCombinationListCount,
  handleOpenVariantDrawer,
  createShopItemProvisionBulk,
  createShopItemProvision,
  setQueryParam,
  changeInventoryVariantFilter,
}) => {
  const { t } = useTranslation('shop');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const formType = isStandaloneItem
    ? ShopItemDetailInventoryFormType.STANDALONE
    : ShopItemDetailInventoryFormType.VARIANTS;

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      setQueryParam('inventorypage')(`${pageNumber}`);
    },
    [setQueryParam],
  );

  const handleOnSubmit = useCallback(
    (
      values: ShopItemTemplateInventoryBulkUpdateFormValues,
      {
        resetForm,
      }: FormikHelpers<ShopItemTemplateInventoryBulkUpdateFormValues>,
    ) => {
      const payload = [];

      for (let i = 0; i < values.instances.length; i += 1) {
        const variant = values.instances[i];
        if (variant.stockAdjustment) {
          payload.push({
            shop_item: variant.id,
            qty: parseInt(variant.stockAdjustment, 10),
          });
        }
      }

      createShopItemProvisionBulk(payload, {
        onSuccess: () => resetForm(),
      });
    },
    [createShopItemProvisionBulk],
  );

  if (
    variantCombinationListCount === 0 &&
    formType === ShopItemDetailInventoryFormType.VARIANTS
  ) {
    return (
      <TabPanel
        className={classes.tabPanelContainer}
        value={ShopItemDetailTab.INVENTORY}
      >
        <div className={classes.tabPanelEmptyContainer}>
          <Typography>
            {t('shop:shopItemDetail.table.variants.placeholder')}
          </Typography>
          <Button
            color="primary"
            onClick={handleOpenVariantDrawer}
            startIcon={<AddIcon />}
            variant="outlined"
          >
            {t('shop:shopItemDetail.table.variants.action.add')}
          </Button>
        </div>
      </TabPanel>
    );
  }

  return (
    <TabPanel
      className={classes.tabPanelContainer}
      value={ShopItemDetailTab.INVENTORY}
    >
      {isMobile ? (
        <FranchiseShopItemDetailInventoryListMobile
          createShopItemProvision={createShopItemProvision}
          formType={formType}
          isUpdatingVariant={isUpdatingVariant}
          shopItemTemplate={shopItemTemplate}
          shopItemVariantList={shopItemTemplateInstanceList}
        />
      ) : (
        <FranchiseShopItemTemplateDetailInventoryList
          changeInventoryVariantFilter={changeInventoryVariantFilter}
          handleSubmit={handleOnSubmit}
          isUpdatingVariant={isUpdatingVariant}
          shopItemTemplate={shopItemTemplate}
          shopItemTemplateInstanceList={shopItemTemplateInstanceList}
          showVariantFilters={shopItemTemplate?.number_of_variants > 0}
          variantColorFilterOptionList={shopItemVariantFilterOptionList.colors}
          variantColorFilterOptionValueList={
            shopItemVariantFilterOptionValues.colors
          }
          variantCompanyFilterOptionList={
            shopItemVariantFilterOptionList.company
          }
          variantCompanyFilterOptionValueList={
            shopItemVariantFilterOptionValues.company
          }
          variantSizeFilterOptionList={shopItemVariantFilterOptionList.sizes}
          variantSizeFilterOptionValueList={
            shopItemVariantFilterOptionValues.sizes
          }
        />
      )}

      <Pagination
        className={classes.justifyCenter}
        count={Math.ceil(count / SHOP_ITEM_VARIANTS_PAGE_SIZE)}
        onChange={handlePageChange}
        page={page}
      />
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  tabPanelEmptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  tabPanelContainer: {
    padding: theme.spacing(2),
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default React.memo(FranchiseShopItemTemplateDetailInventoryTab);
