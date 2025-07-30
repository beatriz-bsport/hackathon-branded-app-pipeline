import React, { useState, useCallback, useMemo, useEffect } from 'react';

import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme, useMediaQuery, Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemFormReworked from '#src/libs/shop/components/ShopItemFormReworked';
import ShopItemDetailProductCard from '#src/libs/shop/components/ShopItemDetailProductCard';
import ShopItemDeleteConfirmDialog from '#src/libs/shop/components/ShopItemDeleteConfirmDialog.component';
import ShopItemDetailTabs from '#src/libs/shop/components/ShopItemDetailTabs';
import ShopItemVariantForm from '#src/libs/shop/components/ShopItemVariantForm';

import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { ShopModalContextProvider } from '#src/hocs/shop-modal-prompt.hoc';

import type {
  ShopItem,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemVariantAttributes,
  ShopSupplier,
  ProvisionBulkCreate,
  Provision,
  ProvisionCreate,
  ShopItemVariantCombination,
  ShopItemBarcodeUnicity,
} from '#src/libs/shop/types';
import type { OptionCallback } from '#src/state/types';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  tab?: string;
  companyId?: number;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isDeleting?: boolean;
  isDeletingVariant?: boolean;
  isUpdatingVariant?: boolean;
  provincialTaxValue: number;
  shopItem: ShopItem;
  shopItemSupplierName?: string;
  variantList: ShopItem[];
  supplierList: ShopSupplier[];
  page: number;
  count: number;
  variantCombinationList: ShopItemVariantCombination[];
  shopItemVariantFilterOptionList: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  shopItemVariantFilterOptionValues: {
    colors: SelectOption[];
    sizes: SelectOption[];
    establishmentBillingGroup: SelectOption;
  };
  isSupplierPriceHidden?: boolean;
  tagList: Tag<TagGroupAPI>[];
  getIsShopItemUsedInCombo: (shopItemId: number) => boolean;
  updateShopItem: (
    formData: Partial<ShopItemEdit>,
    options?: OptionCallback<ShopItem>,
  ) => void;
  updateShopItemVariantBulk: (
    lowestVariantPrice: number,
    data: FormData,
    options?: OptionCallback,
  ) => void;
  deleteShopItem: () => void;
  createShopItemVariants: (
    baseItemId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback<ShopItem[]>,
  ) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  deleteShopItemVariant: (id: number) => void;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  setQueryParam: (queryParam: string) => (value: string) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes',
  ) => (options: SelectOption[]) => void;
  changeEstablishmentBillingGroupFilter: (options: SelectOption) => void;
  checkBarcodeUnicity: (
    barcode: string,
    companyIds?: number[],
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeListUnicity: (barcodeList: string[]) => boolean;
  getShopItemBarcodeUnicity: (barcode: string) => boolean;
  snackbarSuccess: (text: string) => void;
  establishmentBillingGroupFilterOptionList: SelectOption[];
};

const ShopItemDetail: React.FC<Props> = ({
  tab,
  companyId,
  isLoading,
  isVariantListLoading,
  isDeleting,
  isDeletingVariant,
  isUpdatingVariant,
  provincialTaxValue,
  shopItem,
  shopItemSupplierName,
  variantList,
  supplierList,
  count,
  page,
  variantCombinationList,
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  isSupplierPriceHidden,
  tagList,
  getIsShopItemUsedInCombo,
  bookkeepingAccounts,
  bookkeepingAccountById,
  updateShopItem,
  updateShopItemVariantBulk,
  deleteShopItem,
  createShopItemVariants,
  deleteShopItemVariant,
  createShopItemProvision,
  createShopItemProvisionBulk,
  setQueryParam,
  changeInventoryVariantFilter,
  checkBarcodeUnicity,
  getShopItemBarcodeListUnicity,
  getShopItemBarcodeUnicity,
  snackbarSuccess,
  establishmentBillingGroupFilterOptionList,
  changeEstablishmentBillingGroupFilter,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isMobile });

  const { t } = useTranslation('shop');

  const [selectedTab, setSelectedTab] = useState<
    SelectOption<ShopItemDetailTab>
  >({
    label: t('shop:shopItemDetail.tab.inventory'),
    value: ShopItemDetailTab.INVENTORY,
  });

  const variantListCount = count > 0 ? ` (${count})` : '';

  const availableTabListOptions: SelectOption<ShopItemDetailTab>[] = useMemo(
    () => [
      {
        label: t('shop:shopItemDetail.tab.inventory'),
        value: ShopItemDetailTab.INVENTORY,
      },
      {
        label: `${t('shop:shopItemDetail.tab.variants')}${variantListCount}`,
        value: ShopItemDetailTab.VARIANTS,
      },
      {
        label: t('shop:shopItemDetail.tab.settings'),
        value: ShopItemDetailTab.SETTINGS,
      },
    ],
    [t, variantListCount],
  );

  useEffect(() => {
    if (tab && selectedTab.value !== tab) {
      const tabParamOption = availableTabListOptions.find(
        (option) => option.value === tab,
      );
      setSelectedTab(tabParamOption);
    }
  }, [availableTabListOptions, selectedTab, t, tab]);

  const [isEditShopitemDrawerOpen, setIsEditShopitemDrawerOpen] =
    useState(false);

  const [isCreateVariantDrawerOpen, setIsCreateVariantDrawerOpen] =
    useState(false);

  const [selectedVariantBarcode, setSelectedVariantBarcode] = useState<
    string | null
  >(null);

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const [isVariantEditMode, setIsVariantEditMode] = useState(false);

  const [selectedVariantIdToDelete, setSelectedVariantIdToDelete] = useState<
    number | null
  >(null);

  const [
    showVariantDeleteConfirmationModal,
    setShowVariantDeleteConfirmationModal,
  ] = useState(false);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const handleOpenDeleteVariantConfirmationModal = useCallback((id: number) => {
    setSelectedVariantIdToDelete(id);
    setShowVariantDeleteConfirmationModal(true);
  }, []);

  const handleDeleteShopItemVariant = useCallback(
    (id: number) => {
      const shopItemVariant = variantList.find(
        (instance) => instance?.id === id,
      );
      // We display the modal to confirm the deletion of a variant only if the variant has an inventory history
      // Meaning: it has been sold at least once or it has a stock
      const shouldDisplayDeleteModal =
        !!shopItemVariant?.current_stock || !!shopItemVariant?.total_sales;
      if (shouldDisplayDeleteModal) {
        handleOpenDeleteVariantConfirmationModal(id);
      } else {
        deleteShopItemVariant(id);
      }
    },
    [
      deleteShopItemVariant,
      handleOpenDeleteVariantConfirmationModal,
      variantList,
    ],
  );

  const handleCloseDeleteVariantConfirmationModal = useCallback(() => {
    setShowVariantDeleteConfirmationModal(false);
  }, []);

  const handleSubmitDeleteVariant = useCallback(() => {
    handleCloseDeleteVariantConfirmationModal();
    deleteShopItemVariant(selectedVariantIdToDelete);
  }, [
    deleteShopItemVariant,
    handleCloseDeleteVariantConfirmationModal,
    selectedVariantIdToDelete,
  ]);

  const handleOpenBarcodeModal = useCallback((barcode: string) => {
    setSelectedVariantBarcode(barcode);
    setShowBarcodeModal(true);
  }, []);

  const handleCloseBarcodeModal = useCallback(() => {
    setShowBarcodeModal(false);
  }, []);

  const handleOpenDeleteConfirmationModal = useCallback(() => {
    setShowDeleteConfirmationModal(true);
  }, []);

  const handleCloseDeleteConfirmationModal = useCallback(() => {
    setShowDeleteConfirmationModal(false);
  }, []);

  const handleOpenEditShopItemDrawer = useCallback(
    () => setIsEditShopitemDrawerOpen(true),
    [],
  );

  const handleCloseEditShopItemDrawer = useCallback(
    () => setIsEditShopitemDrawerOpen(false),
    [],
  );

  const handleOpenCreateVariantDrawer = useCallback(
    () => setIsCreateVariantDrawerOpen(true),
    [],
  );

  const handleCloseCreateVariantDrawer = useCallback(
    () => setIsCreateVariantDrawerOpen(false),
    [],
  );

  const handleChangeTab = useCallback(
    (option: SelectOption<ShopItemDetailTab>) => {
      const isTabRenderingVariants =
        option.value === ShopItemDetailTab.INVENTORY ||
        option.value === ShopItemDetailTab.VARIANTS;
      /*
       Whenever changing tab, we want to get back to page 1 to prevent
       keeping page number synchronized across tabs. 
       */
      if (page > 1 && isTabRenderingVariants) {
        setQueryParam('page')('1');
      }
      isVariantEditMode && setIsVariantEditMode(false);
      setSelectedTab(option);
    },
    [isVariantEditMode, page, setQueryParam],
  );

  const handleSubmitEditShopItem = useCallback(
    (formData: Partial<ShopItemCreate>) => {
      updateShopItem(formData, {
        onSuccess: () => {
          handleCloseEditShopItemDrawer();
          shopItem?.id && trackFormSuccess(shopItem?.id);
        },
      });
    },
    [handleCloseEditShopItemDrawer, shopItem?.id, updateShopItem],
  );

  const handleSubmitCreateVariant = useCallback(
    (formData: ShopItemVariantAttributes) => {
      createShopItemVariants(shopItem?.id, formData, {
        onSuccess: () => {
          handleCloseCreateVariantDrawer();
        },
      });
    },
    [createShopItemVariants, handleCloseCreateVariantDrawer, shopItem?.id],
  );

  const handleCheckVariantBarcodeUnicity = useCallback(
    (barcode: string, options?: OptionCallback<ShopItemBarcodeUnicity>) => {
      checkBarcodeUnicity(barcode, undefined, options);
    },
    [checkBarcodeUnicity],
  );

  const allVariantsHaveSamePrice = useMemo(() => {
    const initialPrice = shopItem?.price;
    return variantList.every((variant) => variant.price === initialPrice);
  }, [shopItem?.price, variantList]);

  return (
    <div className={classes.container}>
      <ShopItemDetailProductCard
        allVariantsHaveSamePrice={allVariantsHaveSamePrice}
        companyId={companyId}
        cover={shopItem?.cover}
        description={shopItem?.description}
        isDeleting={isDeleting}
        isLoading={isLoading}
        isShopItemFromFranchisor={!!shopItem?.shop_item_template}
        lowestVariantPrice={shopItem?.lowest_variant_price}
        name={shopItem?.name}
        onDeleteShopItem={handleOpenDeleteConfirmationModal}
        onEditShopItem={handleOpenEditShopItemDrawer}
        price={shopItem?.price}
        productHasVariants={count > 0}
        shopItemId={shopItem?.id}
        snackbarSuccess={snackbarSuccess}
        subtitle={shopItem?.subtitle}
      />

      {isMobile && (
        <Select
          isSearchable={false}
          onChange={handleChangeTab}
          options={availableTabListOptions}
          value={selectedTab}
        />
      )}

      <ShopModalContextProvider>
        <ShopItemDetailTabs
          availableTabListOptions={availableTabListOptions}
          changeEstablishmentBillingGroupFilter={
            changeEstablishmentBillingGroupFilter
          }
          changeInventoryVariantFilter={changeInventoryVariantFilter}
          checkBarcodeUnicity={handleCheckVariantBarcodeUnicity}
          companyId={companyId}
          count={count}
          createShopItemProvision={createShopItemProvision}
          createShopItemProvisionBulk={createShopItemProvisionBulk}
          establishmentBillingGroupFilterOptionList={
            establishmentBillingGroupFilterOptionList
          }
          getShopItemBarcodeListUnicity={getShopItemBarcodeListUnicity}
          handleOpenBarcodeModal={handleOpenBarcodeModal}
          handleOpenVariantDrawer={handleOpenCreateVariantDrawer}
          isDeletingVariant={isDeletingVariant}
          isLoading={isLoading}
          isSupplierPriceHidden={isSupplierPriceHidden}
          isUpdatingVariant={isUpdatingVariant}
          isVariantEditMode={isVariantEditMode}
          isVariantListLoading={isVariantListLoading}
          onDeleteShopItemVariant={handleDeleteShopItemVariant}
          page={page}
          selectedTab={selectedTab}
          setIsVariantEditMode={setIsVariantEditMode}
          setQueryParam={setQueryParam}
          shopItem={shopItem}
          shopItemSupplierName={shopItemSupplierName}
          shopItemVariantFilterOptionList={shopItemVariantFilterOptionList}
          shopItemVariantFilterOptionValues={shopItemVariantFilterOptionValues}
          updateShopItemVariantBulk={updateShopItemVariantBulk}
          variantCombinationListCount={(variantCombinationList ?? []).length}
          variantList={variantList}
        />
      </ShopModalContextProvider>

      <GenericResponsiveDrawer
        onClose={handleCloseEditShopItemDrawer}
        open={isEditShopitemDrawerOpen}
        title={t('shop:shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          isEditForm
          bookkeepingAccountById={bookkeepingAccountById}
          bookkeepingAccounts={bookkeepingAccounts}
          checkBarcodeUnicity={checkBarcodeUnicity}
          getShopItemBarcodeUnicity={getShopItemBarcodeUnicity}
          initial={shopItem}
          isLoading={isLoading}
          onCancel={handleCloseEditShopItemDrawer}
          onUpdateSubmit={handleSubmitEditShopItem}
          provincialTax={provincialTaxValue}
          supplierList={supplierList}
          tagList={tagList}
        />
      </GenericResponsiveDrawer>

      <GenericResponsiveDrawer
        onClose={handleCloseCreateVariantDrawer}
        open={isCreateVariantDrawerOpen}
        title={t('shop:shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemVariantForm
          onCancel={handleCloseCreateVariantDrawer}
          onSubmit={handleSubmitCreateVariant}
          variantCombinationList={variantCombinationList}
        />
      </GenericResponsiveDrawer>

      <Dialog
        onClose={handleCloseBarcodeModal}
        open={showBarcodeModal && !!selectedVariantBarcode}
      >
        <Barcode background="#fafafa" value={selectedVariantBarcode} />
      </Dialog>

      <ShopItemDeleteConfirmDialog
        isUsedInCombo={getIsShopItemUsedInCombo(shopItem?.id)}
        onCancel={handleCloseDeleteConfirmationModal}
        onSubmit={deleteShopItem}
        open={showDeleteConfirmationModal}
        shopItemName={shopItem?.name ?? ''}
      />

      <ShopItemDeleteConfirmDialog
        onCancel={handleCloseDeleteVariantConfirmationModal}
        onSubmit={handleSubmitDeleteVariant}
        open={showVariantDeleteConfirmationModal && !!selectedVariantIdToDelete}
      />
    </div>
  );
};

const useStyles = makeStyles<Theme, { isMobile: boolean }>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: ({ isMobile }) => theme.spacing(isMobile ? 2 : 4),
  },
}));

export default React.memo(ShopItemDetail);
