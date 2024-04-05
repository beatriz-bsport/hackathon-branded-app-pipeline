import React, { useCallback } from 'react';

import {
  LinearProgress,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import ShopItemDetailInventoryTab from './tabs/ShopItemDetailInventoryTab.component';
import ShopItemDetailVariantsTab from './tabs/ShopItemDetailVariantsTab.component';
import ShopItemDetailSettingsTab from './tabs/ShopItemDetailSettingsTab.component';
import ShopItemDetailHistoryTab from './tabs/ShopItemDetailHistoryTab.component';

import type {
  ProvisionBulkCreate,
  ShopItem,
  ShopSupplier,
  ShopItemVariant,
  TabListOption,
  ProvisionCreate,
  Provision,
} from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';

import { ShopItemDetailTab } from '../ShopItemDetail/constants';

type Props = {
  companyId?: number;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isUpdatingVariant?: boolean;
  isDeletingVariant?: boolean;
  selectedTab: TabListOption;
  variantList: ShopItemVariant[];
  shopItem: ShopItem;
  shopItemSupplier: ShopSupplier;
  page: number;
  count: number;
  isVariantEditMode?: boolean;
  availableTabListOptions: TabListOption[];
  handleOpenBarcodeModal: (barcode: string) => void;
  handleOpenVariantDrawer: () => void;
  handleChangeTab: (option: TabListOption) => void;
  updateShopItemVariantBulk: (data: FormData, options?: OptionCallback) => void;
  onDeleteShopItemVariant: (id: number) => void;
  fetchShopItemVariantList: (page: number) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  setIsVariantEditMode: (value: boolean) => void;
};

const ShopItemDetailTabs: React.FC<Props> = ({
  companyId,
  isLoading,
  isVariantListLoading,
  isUpdatingVariant,
  isDeletingVariant,
  selectedTab,
  variantList,
  shopItem,
  shopItemSupplier,
  page,
  count,
  isVariantEditMode,
  availableTabListOptions = [],
  handleOpenBarcodeModal,
  handleOpenVariantDrawer,
  handleChangeTab,
  updateShopItemVariantBulk,
  onDeleteShopItemVariant,
  fetchShopItemVariantList,
  createShopItemProvision,
  createShopItemProvisionBulk,
  setIsVariantEditMode,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const onChangeTab = useCallback(
    (_: React.ChangeEvent, value: ShopItemDetailTab) => {
      // find the matching option from the selected value
      const relatedOption = availableTabListOptions.find(
        (option) => option.value === value,
      );
      handleChangeTab({ label: relatedOption?.label ?? '', value });
    },
    [handleChangeTab, availableTabListOptions],
  );

  return (
    <Card>
      <TabContext value={selectedTab.value}>
        {!isMobile && (
          <Tabs
            classes={{ root: classes.tabsContainer }}
            onChange={onChangeTab}
            value={selectedTab.value}
          >
            {availableTabListOptions.map((option) => (
              <Tab
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Tabs>
        )}

        {(isLoading || isVariantListLoading || isDeletingVariant) && (
          <LinearProgress color="primary" />
        )}

        {!isLoading && (
          <>
            <ShopItemDetailInventoryTab
              count={count}
              createShopItemProvision={createShopItemProvision}
              createShopItemProvisionBulk={createShopItemProvisionBulk}
              fetchShopItemVariantList={fetchShopItemVariantList}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isUpdatingVariant={isUpdatingVariant}
              page={page}
              shopItemVariantList={variantList}
            />
            <ShopItemDetailVariantsTab
              companyId={companyId}
              count={count}
              fetchShopItemVariantList={fetchShopItemVariantList}
              handleOpenBarcodeModal={handleOpenBarcodeModal}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isDeletingVariant={isDeletingVariant}
              isVariantEditMode={isVariantEditMode}
              onDeleteShopItemVariant={onDeleteShopItemVariant}
              page={page}
              setIsVariantEditMode={setIsVariantEditMode}
              shopItemVariantList={variantList}
              updateShopItemVariantBulk={updateShopItemVariantBulk}
            />
            {!!shopItem && (
              <ShopItemDetailSettingsTab
                availablePaymentMethodIdentifiers={
                  shopItem.available_payment_method_identifiers
                }
                barcode={shopItem.barcode}
                handleOpenBarcodeModal={handleOpenBarcodeModal}
                isDeliverable={shopItem.is_deliverable}
                isFeatured={shopItem.featured}
                isMarketplaceEnabled={shopItem.marketplace_enabled}
                productHasVariants={count > 0}
                sellOnlyOnProvision={shopItem.sell_only_on_provision}
                stockKeepingUnit={shopItem.stock_keeping_unit}
                supplierName={shopItemSupplier?.name}
                supplierPrice={getCurrencyDisplayWithPrice(
                  shopItem.supplier_price,
                )}
                tva={shopItem.tva}
              />
            )}
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
