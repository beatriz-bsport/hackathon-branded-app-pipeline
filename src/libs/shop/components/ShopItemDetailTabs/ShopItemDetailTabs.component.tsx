import React from 'react';

import { LinearProgress, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';

import ShopItemDetailInventoryTab from './tabs/ShopItemDetailInventoryTab.component';
import ShopItemDetailVariantsTab from './tabs/ShopItemDetailVariantsTab.component';
import ShopItemDetailSettingsTab from './tabs/ShopItemDetailSettingsTab.component';
import ShopItemDetailHistoryTab from './tabs/ShopItemDetailHistoryTab.component';

import type { ShopItemVariant } from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

type Props = {
  companyId?: number;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isDeletingVariant?: boolean;
  selectedTab: string;
  variantList: ShopItemVariant[];
  page: number;
  count: number;
  handleOpenBarcodeModal: (barcode: string) => void;
  handleOpenVariantDrawer: () => void;
  handleChangeTab: (_: React.ChangeEvent, tab: ShopItemDetailTab) => void;
  updateShopItemVariantBulk: (data: FormData, options?: OptionCallback) => void;
  onDeleteShopItemVariant: (id: number) => void;
  fetchShopItemVariantList: (page: number) => void;
};

const ShopItemDetailTabs: React.FC<Props> = ({
  companyId,
  isLoading,
  isVariantListLoading,
  isDeletingVariant,
  selectedTab,
  variantList,
  page,
  count,
  handleOpenBarcodeModal,
  handleOpenVariantDrawer,
  handleChangeTab,
  updateShopItemVariantBulk,
  onDeleteShopItemVariant,
  fetchShopItemVariantList,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('shop');

  const variantListCount = count > 0 ? ` (${count})` : '';

  return (
    <Card>
      <TabContext value={selectedTab}>
        <Tabs
          classes={{ root: classes.tabsContainer }}
          onChange={handleChangeTab}
          value={selectedTab}
        >
          <Tab
            label={t('shop:shopItemDetail.tab.inventory')}
            value={ShopItemDetailTab.INVENTORY}
          />
          <Tab
            label={`${t(
              'shop:shopItemDetail.tab.variants',
            )}${variantListCount}`}
            value={ShopItemDetailTab.VARIANTS}
          />
          <Tab
            label={t('shop:shopItemDetail.tab.settings')}
            value={ShopItemDetailTab.SETTINGS}
          />
          <Tab
            label={t('shop:shopItemDetail.tab.history')}
            value={ShopItemDetailTab.HISTORY}
          />
        </Tabs>

        {(isLoading || isVariantListLoading || isDeletingVariant) && (
          <LinearProgress color="primary" />
        )}

        {!isLoading && (
          <>
            <ShopItemDetailInventoryTab />
            <ShopItemDetailVariantsTab
              companyId={companyId}
              count={count}
              fetchShopItemVariantList={fetchShopItemVariantList}
              handleOpenBarcodeModal={handleOpenBarcodeModal}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isDeletingVariant={isDeletingVariant}
              onDeleteShopItemVariant={onDeleteShopItemVariant}
              page={page}
              shopItemVariantList={variantList}
              updateShopItemVariantBulk={updateShopItemVariantBulk}
            />
            <ShopItemDetailSettingsTab />
            <ShopItemDetailHistoryTab />
          </>
        )}
      </TabContext>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  shopItemCard: {
    marginBottom: theme.spacing(3),
  },
  shopItemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  shopItemContentContainer: {
    display: 'flex',
  },
  shopItemCover: {
    width: 150,
  },
  shopItemText: {
    flex: 1,
    paddingLeft: theme.spacing(2),
  },
  tabsContainer: {
    backgroundColor: theme.palette.background.default,
  },
  tableContainer: {
    paddingBottom: theme.spacing(2),
  },
  tableEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  tablePagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

export default React.memo(ShopItemDetailTabs);
