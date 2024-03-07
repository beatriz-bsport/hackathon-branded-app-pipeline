import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ShopListProductsTab from './tabs/ShopListProductsTab.component';
import ShopListSettingsTab from './tabs/ShopListSettingsTab.component';

import type { ShopItem, ShopSupplier, SubShop } from '#libs/shop/types';

import { ShopListTab } from './constants';

type Props = {
  subshopList: SubShop[];
  supplierList: ShopSupplier[];
  goToShopItem: (id: number) => void;
  setSelectedSubshopId: (id: number) => void;
  openItemCreationDrawer: () => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  setShopItemToDelete: (shopItem: ShopItem) => void;
  handleChangeTab: (tab: ShopListTab) => void;
  handleSelectSupplierForDeletion: (supplier: ShopSupplier) => () => void;
  handleEditSupplier: (supplier: ShopSupplier) => () => void;
  handleOpenSupplierModal: () => void;
};

const ShopListTabs: React.FC<Props> = ({
  subshopList,
  supplierList,
  goToShopItem,
  setSelectedSubshopId,
  openItemCreationDrawer,
  duplicateShopItem,
  setShopItemToDelete,
  handleChangeTab,
  handleSelectSupplierForDeletion,
  handleEditSupplier,
  handleOpenSupplierModal,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const [selectedTab, setSelectedTab] = useState<ShopListTab>(
    ShopListTab.PRODUCTS,
  );

  const onChangeTab = useCallback(
    (_: React.ChangeEvent, value: ShopListTab) => {
      setSelectedTab(value);
      handleChangeTab?.(value);
    },
    [handleChangeTab],
  );

  return (
    <TabContext value={selectedTab}>
      <Tabs
        className={classes.tabsContainer}
        onChange={onChangeTab}
        value={selectedTab}
      >
        <Tab
          label={t('shopList.tab.products.title')}
          value={ShopListTab.PRODUCTS}
        />
        <Tab
          label={t('shopList.tab.settings.title')}
          value={ShopListTab.SETTINGS}
        />
      </Tabs>

      <ShopListProductsTab
        duplicateShopItem={duplicateShopItem}
        goToShopItem={goToShopItem}
        openItemCreationDrawer={openItemCreationDrawer}
        setSelectedSubshopId={setSelectedSubshopId}
        setShopItemToDelete={setShopItemToDelete}
        subshopList={subshopList}
      />

      <ShopListSettingsTab
        handleEditSupplier={handleEditSupplier}
        handleOpenSupplierModal={handleOpenSupplierModal}
        handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
        supplierList={supplierList}
      />
    </TabContext>
  );
};

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    background: theme.palette.grey[100],
  },
}));

export default React.memo(ShopListTabs);
