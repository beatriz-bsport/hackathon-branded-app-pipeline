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

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import { useShopDetailTabsModalPrompt } from '#src/hocs/shop-modal-prompt.hoc';

import PromptOnPageLeaveComponent from '#src/components/Prompt';
import type {
  ProvisionBulkCreate,
  ShopItem,
  ProvisionCreate,
  Provision,
  ShopItemBarcodeUnicity,
} from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';
import ShopItemDetailInventoryTab from '#src/libs/shop/components/ShopItemDetailTabs/tabs/ShopItemDetailInventoryTab.component';
import ShopItemDetailVariantsTab from '#src/libs/shop/components/ShopItemDetailTabs/tabs/ShopItemDetailVariantsTab.component';
import ShopItemDetailSettingsTab from '#src/libs/shop/components/ShopItemDetailTabs/tabs/ShopItemDetailSettingsTab.component';
import ShopItemDetailHistoryTab from '#src/libs/shop/components/ShopItemDetailTabs/tabs/ShopItemDetailHistoryTab.component';

import type { OptionCallback } from '#src/state/types';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';

type Props = {
  companyId?: number;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isUpdatingVariant?: boolean;
  isDeletingVariant?: boolean;
  selectedTab: SelectOption<ShopItemDetailTab>;
  variantList: ShopItem[];
  shopItem: ShopItem;
  shopItemSupplierName?: string;
  page: number;
  count: number;
  isVariantEditMode?: boolean;
  availableTabListOptions: SelectOption<ShopItemDetailTab>[];
  shopItemVariantFilterOptionList: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  shopItemVariantFilterOptionValues: {
    colors: SelectOption[];
    sizes: SelectOption[];
    establishmentBillingGroup: SelectOption;
  };
  variantCombinationListCount: number;
  isSupplierPriceHidden?: boolean;
  handleOpenBarcodeModal: (barcode: string) => void;
  handleOpenVariantDrawer: () => void;
  updateShopItemVariantBulk: (
    lowestVariantPrice: number,
    data: FormData,
    options?: OptionCallback,
  ) => void;
  onDeleteShopItemVariant: (id: number) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  setIsVariantEditMode: (value: boolean) => void;
  setQueryParam: (queryParam: string) => (value: string) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes',
  ) => (options: SelectOption[]) => void;
  changeEstablishmentBillingGroupFilter: (options: SelectOption) => void;
  checkBarcodeUnicity: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeListUnicity: (barcodeList: string[]) => boolean;
  establishmentBillingGroupFilterOptionList: SelectOption[];
  isMultiLocationWebshopEnabled: boolean;
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
  shopItemSupplierName,
  page,
  count,
  isVariantEditMode,
  availableTabListOptions = [],
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  variantCombinationListCount,
  isSupplierPriceHidden,
  handleOpenBarcodeModal,
  handleOpenVariantDrawer,
  updateShopItemVariantBulk,
  onDeleteShopItemVariant,
  createShopItemProvision,
  createShopItemProvisionBulk,
  setIsVariantEditMode,
  setQueryParam,
  changeInventoryVariantFilter,
  checkBarcodeUnicity,
  getShopItemBarcodeListUnicity,
  establishmentBillingGroupFilterOptionList,
  changeEstablishmentBillingGroupFilter,
  isMultiLocationWebshopEnabled,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const {
    isInventoryFormDirty,
    isVariantFormDirty,
    modalTitle,
    modalDescription,
    leaveWithoutSavingText,
    leaveWithSavingText,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  } = useShopDetailTabsModalPrompt();

  const onChangeTab = useCallback(
    (_: React.ChangeEvent, value: ShopItemDetailTab) => {
      setQueryParam('tab')(value);
    },
    [setQueryParam],
  );

  return (
    <Card>
      <TabContext value={selectedTab.value}>
        <PromptOnPageLeaveComponent
          forceCloseOnLeave
          openPromptOnPageLeave
          description={modalDescription}
          isDataClean={!isInventoryFormDirty && !isVariantFormDirty}
          leaveWithoutSavingText={leaveWithoutSavingText}
          leaveWithSavingText={leaveWithSavingText}
          onLeaveWithoutSaving={handleLeaveWithoutSaving}
          onLeaveWithSaving={handleSaveAndLeave}
          title={modalTitle}
        />

        {!isMobile && (
          <Tabs
            classes={{ root: classes.tabsContainer }}
            onChange={onChangeTab}
            selectionFollowsFocus={false}
            value={selectedTab.value}
          >
            {availableTabListOptions.map((option) => (
              <Tab
                key={option.value}
                className={classes.tab}
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
              changeEstablishmentBillingGroupFilter={
                changeEstablishmentBillingGroupFilter
              }
              changeInventoryVariantFilter={changeInventoryVariantFilter}
              count={count}
              createShopItemProvision={createShopItemProvision}
              createShopItemProvisionBulk={createShopItemProvisionBulk}
              establishmentBillingGroupFilterOptionList={
                establishmentBillingGroupFilterOptionList
              }
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isMultiLocationWebshopEnabled={isMultiLocationWebshopEnabled}
              isStandaloneItem={shopItem?.is_standalone_item}
              isUpdatingVariant={isUpdatingVariant}
              page={page}
              setQueryParam={setQueryParam}
              shopItem={shopItem}
              shopItemVariantFilterOptionList={shopItemVariantFilterOptionList}
              shopItemVariantFilterOptionValues={
                shopItemVariantFilterOptionValues
              }
              shopItemVariantList={variantList}
              variantCombinationListCount={variantCombinationListCount}
            />

            <ShopItemDetailVariantsTab
              checkBarcodeUnicity={checkBarcodeUnicity}
              companyId={companyId}
              count={count}
              getShopItemBarcodeListUnicity={getShopItemBarcodeListUnicity}
              handleOpenBarcodeModal={handleOpenBarcodeModal}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isDeletingVariant={isDeletingVariant}
              isShopItemFromFranchisor={!!shopItem?.shop_item_template}
              isSupplierPriceHidden={isSupplierPriceHidden}
              isVariantEditMode={isVariantEditMode}
              onDeleteShopItemVariant={onDeleteShopItemVariant}
              page={page}
              setIsVariantEditMode={setIsVariantEditMode}
              setQueryParam={setQueryParam}
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
                isSupplierPriceHidden={isSupplierPriceHidden}
                productHasVariants={count > 0}
                sellOnlyOnProvision={shopItem.sell_only_on_provision}
                stockKeepingUnit={shopItem.stock_keeping_unit}
                supplierName={shopItemSupplierName}
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
  tab: {
    '&:focus, &:hover': {
      color: 'inherit',
    },
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
