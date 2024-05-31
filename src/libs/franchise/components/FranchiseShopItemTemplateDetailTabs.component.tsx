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

import { useShopDetailTabsModalPrompt } from '#src/hocs/shop-modal-prompt.hoc';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import PromptOnPageLeaveComponent from '#src/components/Prompt';
import FranchiseShopItemTemplateDetailInventoryTab from './FranchiseShopItemTemplateDetailInventoryTab.component';
import FranchiseShopItemTemplateDetailVariantsTab from './FranchiseShopItemTemplateDetailVariantsTab.component';

import ShopItemDetailSettingsTab from '#src/libs/shop/components/ShopItemDetailTabs/tabs/ShopItemDetailSettingsTab.component';

import type {
  ProvisionBulkCreate,
  ShopItem,
  TabListOption,
  ProvisionCreate,
  Provision,
  ShopItemTemplate,
} from '#src/libs/shop/types';
import type { OptionCallback } from '#src/state/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';

type Props = {
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isUpdatingVariant?: boolean;
  isDeletingVariant?: boolean;
  isVariantEditMode?: boolean;
  selectedTab: TabListOption;
  variantList: ShopItemTemplate[];
  shopItemTemplateInstanceList: ShopItem[];
  shopItemTemplate: ShopItemTemplate;
  shopItemTemplateVariantPage: number;
  shopItemTemplateInstancePage: number;
  shopItemTemplateVariantCount: number;
  shopItemTemplateInstanceCount: number;
  availableTabListOptions: TabListOption[];
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
  shopItemTemplateSupplierName?: string;
  setQueryParam: (queryParam: string) => (value: string) => void;
  handleOpenVariantDrawer: () => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes' | 'company',
  ) => (options: SelectOption[]) => void;
  handleOpenBarcodeModal: (barcode: string) => void;
  onDeleteShopItemVariant: (id: number) => void;
  updateShopItemTemplateVariantBulk: (
    data: FormData,
    options?: OptionCallback,
  ) => void;
  setIsVariantEditMode: (value: boolean) => void;
};

const FranchiseShopItemTemplateDetailTabs: React.FC<Props> = ({
  isLoading,
  isVariantListLoading,
  isUpdatingVariant,
  isDeletingVariant,
  isVariantEditMode,
  selectedTab,
  variantList,
  shopItemTemplateInstanceList,
  shopItemTemplate,
  shopItemTemplateVariantPage,
  shopItemTemplateInstancePage,
  shopItemTemplateVariantCount,
  shopItemTemplateInstanceCount,
  availableTabListOptions = [],
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  variantCombinationListCount,
  shopItemTemplateSupplierName,
  setQueryParam,
  handleOpenVariantDrawer,
  createShopItemProvision,
  createShopItemProvisionBulk,
  changeInventoryVariantFilter,
  handleOpenBarcodeModal,
  onDeleteShopItemVariant,
  updateShopItemTemplateVariantBulk,
  setIsVariantEditMode,
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
            <FranchiseShopItemTemplateDetailInventoryTab
              changeInventoryVariantFilter={changeInventoryVariantFilter}
              count={shopItemTemplateInstanceCount}
              createShopItemProvision={createShopItemProvision}
              createShopItemProvisionBulk={createShopItemProvisionBulk}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isStandaloneItem={shopItemTemplate?.is_standalone_item}
              isUpdatingVariant={isUpdatingVariant}
              page={shopItemTemplateInstancePage}
              setQueryParam={setQueryParam}
              shopItemTemplate={shopItemTemplate}
              shopItemTemplateInstanceList={shopItemTemplateInstanceList}
              shopItemVariantFilterOptionList={shopItemVariantFilterOptionList}
              shopItemVariantFilterOptionValues={
                shopItemVariantFilterOptionValues
              }
              variantCombinationListCount={variantCombinationListCount}
            />
          </>
        )}

        <FranchiseShopItemTemplateDetailVariantsTab
          count={shopItemTemplateVariantCount}
          handleOpenBarcodeModal={handleOpenBarcodeModal}
          handleOpenVariantDrawer={handleOpenVariantDrawer}
          isDeletingVariant={isDeletingVariant}
          isVariantEditMode={isVariantEditMode}
          onDeleteShopItemVariant={onDeleteShopItemVariant}
          page={shopItemTemplateVariantPage}
          setIsVariantEditMode={setIsVariantEditMode}
          setQueryParam={setQueryParam}
          shopItemTemplateVariantList={variantList}
          updateShopItemTemplateVariantBulk={updateShopItemTemplateVariantBulk}
        />

        {!!shopItemTemplate && (
          <ShopItemDetailSettingsTab
            availablePaymentMethodIdentifiers={
              shopItemTemplate.available_payment_method_identifiers
            }
            barcode={shopItemTemplate.barcode}
            handleOpenBarcodeModal={handleOpenBarcodeModal}
            isDeliverable={shopItemTemplate.is_deliverable}
            isFeatured={shopItemTemplate.featured}
            isMarketplaceEnabled={shopItemTemplate.marketplace_enabled}
            productHasVariants={shopItemTemplateVariantCount > 0}
            sellOnlyOnProvision={shopItemTemplate.sell_only_on_provision}
            stockKeepingUnit={shopItemTemplate.stock_keeping_unit}
            supplierName={shopItemTemplateSupplierName}
            supplierPrice={getCurrencyDisplayWithPrice(
              shopItemTemplate.supplier_price,
            )}
            tva={shopItemTemplate.tva}
          />
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

export default React.memo(FranchiseShopItemTemplateDetailTabs);
