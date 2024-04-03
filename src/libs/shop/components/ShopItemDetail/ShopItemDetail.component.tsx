import React, { useState, useCallback, useMemo } from 'react';

// @ts-expect-error
import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme, useMediaQuery, Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemFormReworked from '#libs/shop/components/ShopItemFormReworked';
import ShopItemDetailProductCard from '#libs/shop/components/ShopItemDetailProductCard';
import ShopItemDeleteConfirmDialog from '#libs/shop/components/ShopItemDeleteConfirmDialog.component';
import ShopItemDetailTabs from '#libs/shop/components/ShopItemDetailTabs';
import ShopItemVariantForm from '#libs/shop/components/ShopItemVariantForm';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

import type {
  ShopItem,
  ShopItemVariant,
  ShopItemCreate,
  ShopItemEdit,
  ShopItemVariantAttributes,
  ShopSupplier,
  ProvisionBulkCreate,
  TabListOption,
} from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  companyId?: number;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isDeleting?: boolean;
  isDeletingVariant?: boolean;
  isUpdatingVariant?: boolean;
  provincialTaxValue: number;
  shopItem: ShopItem;
  shopItemSupplier: ShopSupplier;
  variantList: ShopItemVariant[];
  supplierList: ShopSupplier[];
  page: number;
  count: number;
  getIsShopItemUsedInCombo: (shopItemId: number) => boolean;
  updateShopItem: (
    formData: Partial<ShopItemEdit>,
    id: number,
    options?: OptionCallback<ShopItem>,
  ) => void;
  updateShopItemVariantBulk: (data: FormData, options?: OptionCallback) => void;
  deleteShopItem: () => void;
  createShopItemVariants: (
    baseItemId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback<ShopItemVariant[]>,
  ) => void;
  fetchShopItemVariantList: (page: number) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  deleteShopItemVariant: (id: number) => void;
};

const ShopItemDetail: React.FC<Props> = ({
  companyId,
  isLoading,
  isVariantListLoading,
  isDeleting,
  isDeletingVariant,
  isUpdatingVariant,
  provincialTaxValue,
  shopItem,
  shopItemSupplier,
  variantList,
  supplierList,
  count,
  page,
  getIsShopItemUsedInCombo,
  updateShopItem,
  updateShopItemVariantBulk,
  deleteShopItem,
  createShopItemVariants,
  fetchShopItemVariantList,
  deleteShopItemVariant,
  createShopItemProvisionBulk,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isMobile });

  const { t } = useTranslation('shop');

  const [selectedTab, setSelectedTab] = useState<TabListOption>({
    label: t('shop:shopItemDetail.tab.inventory'),
    value: ShopItemDetailTab.INVENTORY,
  });

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
    (option: TabListOption) => {
      const isTabRenderingVariants =
        option.value === ShopItemDetailTab.INVENTORY ||
        option.value === ShopItemDetailTab.VARIANTS;
      /* 
       Whenever changing tab, we want to get back to page 1 to prevent
       keeping page number synchronized across tabs. 
       */
      if (page > 1 && isTabRenderingVariants) {
        fetchShopItemVariantList(1);
      }
      isVariantEditMode && setIsVariantEditMode(false);
      setSelectedTab(option);
    },
    [fetchShopItemVariantList, isVariantEditMode, page],
  );

  const handleSubmitEditShopItem = useCallback(
    (formData: Partial<ShopItemCreate>) => {
      updateShopItem(formData, shopItem?.id, {
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

  const allVariantsHaveSamePrice = useMemo(() => {
    const initialPrice = shopItem?.price;
    return variantList.every((variant) => variant.price === initialPrice);
  }, [shopItem?.price, variantList]);

  const variantListCount = count > 0 ? ` (${count})` : '';

  const availableTabListOptions: TabListOption[] = useMemo(
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

  return (
    <div className={classes.container}>
      <ShopItemDetailProductCard
        allVariantsHaveSamePrice={allVariantsHaveSamePrice}
        cover={shopItem?.cover}
        description={shopItem?.description}
        isDeleting={isDeleting}
        isLoading={isLoading}
        lowestVariantPrice={shopItem?.lowest_variant_price}
        name={shopItem?.name}
        onDeleteShopItem={handleOpenDeleteConfirmationModal}
        onEditShopItem={handleOpenEditShopItemDrawer}
        price={shopItem?.price}
        productHasVariants={count > 0}
        subtitle={shopItem?.subtitle}
      />

      {isMobile && (
        <Select
          onChange={handleChangeTab}
          options={availableTabListOptions}
          value={selectedTab}
        />
      )}

      <ShopItemDetailTabs
        availableTabListOptions={availableTabListOptions}
        companyId={companyId}
        count={count}
        createShopItemProvisionBulk={createShopItemProvisionBulk}
        fetchShopItemVariantList={fetchShopItemVariantList}
        handleChangeTab={handleChangeTab}
        handleOpenBarcodeModal={handleOpenBarcodeModal}
        handleOpenVariantDrawer={handleOpenCreateVariantDrawer}
        isDeletingVariant={isDeletingVariant}
        isLoading={isLoading}
        isUpdatingVariant={isUpdatingVariant}
        isVariantEditMode={isVariantEditMode}
        isVariantListLoading={isVariantListLoading}
        onDeleteShopItemVariant={handleOpenDeleteVariantConfirmationModal}
        page={page}
        selectedTab={selectedTab}
        setIsVariantEditMode={setIsVariantEditMode}
        shopItem={shopItem}
        shopItemSupplier={shopItemSupplier}
        updateShopItemVariantBulk={updateShopItemVariantBulk}
        variantList={variantList}
      />

      <GenericResponsiveDrawer
        onClose={handleCloseEditShopItemDrawer}
        open={isEditShopitemDrawerOpen}
        title={t('shop:shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          isEditForm
          initial={shopItem}
          isLoading={isLoading}
          onCancel={handleCloseEditShopItemDrawer}
          onUpdateSubmit={handleSubmitEditShopItem}
          provincialTax={provincialTaxValue}
          supplierList={supplierList}
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
