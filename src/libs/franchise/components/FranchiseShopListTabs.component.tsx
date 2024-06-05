import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import type {
  ShopItemTemplate,
  ShopSupplierTemplate,
  SubshopTemplate,
} from '#src/libs/shop/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { ErrorAndLoading } from '#src/libs/types';

import { ShopListTab } from '#src/libs/shop/components/ShopListTabs/constants';
import FranchiseShopListSettingsTab from './FranchiseShopListSettingsTab.component';
import FranchiseShopListProductsTab from './FranchiseShopListProductsTab.component';

type Props = {
  subshopTemplateList: SubshopTemplate[];
  supplierTemplateList: ShopSupplierTemplate[];
  supplierTemplateListCount: number;
  supplierTemplateListPage: number;
  isSupplierTemplateListLoading?: boolean;
  isFranchiseLoading?: boolean;
  isFranchiseeSupplierPriceHidden?: boolean;
  goToShopItemTemplate: (shopItemTemplateId: number) => void;
  createSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  updateSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  deleteSubshopTemplate: (id: number, options?: OptionCallback<number>) => void;
  getShopItemTemplateState: (
    subshopTemplateId: number,
  ) => ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
  fetchShopItemTemplateList: (
    subshopTemplateId: number,
    page?: number,
    options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
  ) => void;
  handleSelectSupplierTemplateForDeletion: (
    supplier: ShopSupplierTemplate,
  ) => void;
  handleEditSupplierTemplate: (supplier: ShopSupplierTemplate) => void;
  handleOpenSupplierTemplateModal: () => void;
  changeSupplierTemplatePage: (page: number) => void;
  handleOpenShopItemTemplateForm: (subshopTemplateId: number) => void;
  handleSetShopItemTemplateToDelete: (
    shopItemTemplate: ShopItemTemplate,
    subshopTemplateId: number,
  ) => void;
  changeHideShopSupplierPrice: (
    event: React.ChangeEvent<HTMLInputElement>,
    hideShopSupplierPriceForFranchisees: boolean,
  ) => void;
};

const FranchiseShopListTabs: React.FC<Props> = ({
  subshopTemplateList,
  supplierTemplateList,
  supplierTemplateListCount,
  supplierTemplateListPage,
  isSupplierTemplateListLoading,
  isFranchiseLoading,
  isFranchiseeSupplierPriceHidden,
  getShopItemTemplateState,
  createSubshopTemplate,
  updateSubshopTemplate,
  deleteSubshopTemplate,
  fetchShopItemTemplateList,
  handleSelectSupplierTemplateForDeletion,
  handleEditSupplierTemplate,
  handleOpenSupplierTemplateModal,
  changeSupplierTemplatePage,
  handleOpenShopItemTemplateForm,
  handleSetShopItemTemplateToDelete,
  goToShopItemTemplate,
  changeHideShopSupplierPrice,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const [selectedTab, setSelectedTab] = useState<ShopListTab>(
    ShopListTab.PRODUCTS,
  );

  const onChangeTab = useCallback(
    (_: React.ChangeEvent, value: ShopListTab) => {
      setSelectedTab(value);
    },
    [],
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

      <FranchiseShopListProductsTab
        createSubshopTemplate={createSubshopTemplate}
        deleteSubshopTemplate={deleteSubshopTemplate}
        fetchShopItemTemplateList={fetchShopItemTemplateList}
        getShopItemTemplateState={getShopItemTemplateState}
        goToShopItemTemplate={goToShopItemTemplate}
        handleOpenShopItemTemplateForm={handleOpenShopItemTemplateForm}
        handleSetShopItemTemplateToDelete={handleSetShopItemTemplateToDelete}
        subshopTemplateList={subshopTemplateList}
        updateSubshopTemplate={updateSubshopTemplate}
      />

      <FranchiseShopListSettingsTab
        changeHideShopSupplierPrice={changeHideShopSupplierPrice}
        changeSupplierTemplatePage={changeSupplierTemplatePage}
        handleEditSupplierTemplate={handleEditSupplierTemplate}
        handleOpenSupplierTemplateModal={handleOpenSupplierTemplateModal}
        handleSelectSupplierTemplateForDeletion={
          handleSelectSupplierTemplateForDeletion
        }
        isFranchiseeSupplierPriceHidden={isFranchiseeSupplierPriceHidden}
        isFranchiseLoading={isFranchiseLoading}
        isSupplierTemplateListLoading={isSupplierTemplateListLoading}
        supplierTemplateList={supplierTemplateList}
        supplierTemplateListCount={supplierTemplateListCount}
        supplierTemplateListPage={supplierTemplateListPage}
      />
    </TabContext>
  );
};

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    background: theme.palette.grey[100],
  },
}));

export default React.memo(FranchiseShopListTabs);
