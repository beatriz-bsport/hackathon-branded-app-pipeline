import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import ShopItemDetailInventoryList from '../../ShopItemDetailInventoryList/ShopItemDetailInventoryList.component';
import ShopItemDetailInventoryListMobile from '../../ShopItemDetailInventoryListMobile/ShopItemDetailInventoryListMobile.component';

import type {
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItem,
  ShopItemVariant,
} from '#libs/shop/types';
import type { ShopItemInventoryBulkUpdateFormValues } from '#libs/shop/components/ShopItemInventoryBulkUpdateForm/types';
import type { OptionCallback } from '../../../../../state/types';
import type { ShopItemInventoryFormValues } from '../../ShopItemInventoryUpdateForm/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import {
  SHOP_ITEM_VARIANTS_PAGE_SIZE,
  ShopItemDetailInventoryFormType,
} from '#libs/shop/constants';

type Props = {
  shopItemVariantList: ShopItemVariant[];
  page: number;
  count: number;
  isUpdatingVariant?: boolean;
  isStandaloneItem?: boolean;
  shopItem: ShopItem;
  handleOpenVariantDrawer: () => void;
  fetchShopItemVariantList: (page: number) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
};

const ShopItemDetailInventoryTab: React.FC<Props> = ({
  shopItemVariantList,
  page,
  count,
  isUpdatingVariant,
  isStandaloneItem,
  shopItem,
  handleOpenVariantDrawer,
  fetchShopItemVariantList,
  createShopItemProvisionBulk,
  createShopItemProvision,
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
      fetchShopItemVariantList(pageNumber);
    },
    [fetchShopItemVariantList],
  );

  const handleOnSubmitVariants = useCallback(
    (
      values: ShopItemInventoryBulkUpdateFormValues,
      { resetForm }: FormikHelpers<ShopItemInventoryBulkUpdateFormValues>,
    ) => {
      const payload = [];

      for (let i = 0; i < values.variants.length; i += 1) {
        const variant = values.variants[i];
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

  const handleOnSubmitStandalone = useCallback(
    (
      values: ShopItemInventoryFormValues,
      { resetForm }: FormikHelpers<ShopItemInventoryFormValues>,
    ) => {
      shopItem?.id &&
        createShopItemProvision(
          {
            shop_item: shopItem?.id,
            qty: parseInt(values.stockAdjustment, 10),
          },
          {
            onSuccess: () => resetForm(),
          },
        );
    },
    [createShopItemProvision, shopItem?.id],
  );

  const submitHandlerMapper = {
    [ShopItemDetailInventoryFormType.STANDALONE]: handleOnSubmitStandalone,
    [ShopItemDetailInventoryFormType.VARIANTS]: handleOnSubmitVariants,
  };

  if (
    shopItemVariantList?.length === 0 &&
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
        <ShopItemDetailInventoryListMobile
          createShopItemProvision={createShopItemProvision}
          isUpdatingVariant={isUpdatingVariant}
          shopItemVariantList={shopItemVariantList}
        />
      ) : (
        <ShopItemDetailInventoryList
          formType={formType}
          handleSubmit={submitHandlerMapper[formType]}
          isUpdatingVariant={isUpdatingVariant}
          shopItem={shopItem}
          shopItemVariantList={shopItemVariantList}
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

export default React.memo(ShopItemDetailInventoryTab);
