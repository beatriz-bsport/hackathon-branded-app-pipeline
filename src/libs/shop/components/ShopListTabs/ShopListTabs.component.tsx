import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ShopListProductsTab from './tabs/ShopListProductsTab.component';
import ShopListSettingsTab from './tabs/ShopListSettingsTab.component';

import type { ShopItem, ShopSupplier, SubShop } from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { DeliveryConfiguration, DeliveryFee } from '#libs/order/types';

import { ShopListTab } from './constants';

type Props = {
  subshopList: SubShop[];
  supplierList: ShopSupplier[];
  supplierListCount: number;
  supplierListPage: number;
  deliveryConfiguration: DeliveryConfiguration;
  deliveryFees: DeliveryFee[];
  isOrderConfigurationLoading?: boolean;
  isOrderConfigurationUpdateLoading?: boolean;
  goToShopItem: (id: number) => void;
  setSelectedSubshopId: (id: number) => void;
  openItemCreationDrawer: () => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  setShopItemToDelete: (shopItem: ShopItem) => void;
  handleChangeTab: (tab: ShopListTab) => void;
  handleSelectSupplierForDeletion: (supplier: ShopSupplier) => () => void;
  handleEditSupplier: (supplier: ShopSupplier) => () => void;
  handleOpenSupplierModal: () => void;
  createSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  updateSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  deleteSubshop: (id: number, options?: OptionCallback<number>) => void;
  handleOpenDeliveryFeeModal: () => void;
  handleEditDeliveryFee: (deliveryFee: DeliveryFee) => void;
  patchDeliveryFee: (data: DeliveryConfiguration) => void;
  disableDeliveryFee: (deliveryFee: DeliveryFee) => void;
  changeSupplierPage: (
    page: number,
    options?: OptionCallback<ShopSupplier[]>,
  ) => void;
};

const ShopListTabs: React.FC<Props> = ({
  subshopList,
  supplierList,
  supplierListCount,
  supplierListPage,
  deliveryConfiguration,
  deliveryFees,
  isOrderConfigurationLoading,
  isOrderConfigurationUpdateLoading,
  goToShopItem,
  setSelectedSubshopId,
  openItemCreationDrawer,
  duplicateShopItem,
  setShopItemToDelete,
  handleChangeTab,
  handleSelectSupplierForDeletion,
  handleEditSupplier,
  handleOpenSupplierModal,
  createSubshop,
  updateSubshop,
  deleteSubshop,
  handleOpenDeliveryFeeModal,
  handleEditDeliveryFee,
  patchDeliveryFee,
  disableDeliveryFee,
  changeSupplierPage,
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
        createSubshop={createSubshop}
        deleteSubshop={deleteSubshop}
        duplicateShopItem={duplicateShopItem}
        goToShopItem={goToShopItem}
        openItemCreationDrawer={openItemCreationDrawer}
        setSelectedSubshopId={setSelectedSubshopId}
        setShopItemToDelete={setShopItemToDelete}
        subshopList={subshopList}
        updateSubshop={updateSubshop}
      />

      <ShopListSettingsTab
        changeSupplierPage={changeSupplierPage}
        deliveryConfiguration={deliveryConfiguration}
        deliveryFees={deliveryFees}
        disableDeliveryFee={disableDeliveryFee}
        handleEditDeliveryFee={handleEditDeliveryFee}
        handleEditSupplier={handleEditSupplier}
        handleOpenDeliveryFeeModal={handleOpenDeliveryFeeModal}
        handleOpenSupplierModal={handleOpenSupplierModal}
        handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
        isOrderConfigurationLoading={isOrderConfigurationLoading}
        isOrderConfigurationUpdateLoading={isOrderConfigurationUpdateLoading}
        patchDeliveryFee={patchDeliveryFee}
        supplierList={supplierList}
        supplierListCount={supplierListCount}
        supplierListPage={supplierListPage}
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
