import React, { useState, useCallback, useMemo } from 'react';

// @ts-expect-error
import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

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
  ShopItemSupplier,
} from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  companyId?: number;
  isShopItemUsedInCombo?: boolean;
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isDeleting?: boolean;
  isDeletingVariant?: boolean;
  provincialTaxValue: number;
  shopItem: ShopItem;
  shopItemSupplier: ShopItemSupplier;
  variantList: ShopItemVariant[];
  page: number;
  count: number;
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
  deleteShopItemVariant: (id: number) => void;
};

const ShopItemDetail: React.FC<Props> = ({
  companyId,
  isShopItemUsedInCombo,
  isLoading,
  isVariantListLoading,
  isDeleting,
  isDeletingVariant,
  provincialTaxValue,
  shopItem,
  shopItemSupplier,
  variantList,
  count,
  page,
  updateShopItem,
  updateShopItemVariantBulk,
  deleteShopItem,
  createShopItemVariants,
  fetchShopItemVariantList,
  deleteShopItemVariant,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

  const [selectedTab, setSelectedTab] = useState<ShopItemDetailTab>(
    ShopItemDetailTab.VARIANTS,
  );

  const [isEditShopitemDrawerOpen, setIsEditShopitemDrawerOpen] =
    useState(false);

  const [isCreateVariantDrawerOpen, setIsCreateVariantDrawerOpen] =
    useState(false);

  const [selectedVariantBarcode, setSelectedVariantBarcode] = useState<
    string | null
  >(null);

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

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
    (_: React.ChangeEvent, tab: ShopItemDetailTab) => {
      setSelectedTab(tab);
    },
    [],
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

      <ShopItemDetailTabs
        companyId={companyId}
        count={count}
        fetchShopItemVariantList={fetchShopItemVariantList}
        handleChangeTab={handleChangeTab}
        handleOpenBarcodeModal={handleOpenBarcodeModal}
        handleOpenVariantDrawer={handleOpenCreateVariantDrawer}
        isDeletingVariant={isDeletingVariant}
        isLoading={isLoading}
        isVariantListLoading={isVariantListLoading}
        onDeleteShopItemVariant={handleOpenDeleteVariantConfirmationModal}
        page={page}
        selectedTab={selectedTab}
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
        isUsedInCombo={isShopItemUsedInCombo}
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

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default React.memo(ShopItemDetail);
