import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import DeliveryFeeDialogForm from '#src/libs/order/components/DeliveryFeeDialogForm.component';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemDeleteConfirmDialog from '#src/libs/shop/components/ShopItemDeleteConfirmDialog.component';
import ShopItemFormReworked from '#src/libs/shop/components/ShopItemFormReworked';
import ShopListSettingsSupplierModal from '#src/libs/shop/components/ShopListSettingsSupplierModal';
import ShopListTabs from '#src/libs/shop/components/ShopListTabs';
import ShopSupplierDeleteConfirmModal from '#src/libs/shop/components/ShopSupplierDeleteConfirmModal';

import type {
  ShopItem,
  ShopItemCreate,
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierUpdate,
  SubShop,
  ShopItemBarcodeUnicity,
} from '#src/libs/shop/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { ShopListSettingsSupplierValues } from '#src/libs/shop/components/ShopListSettingsSupplierModal/types';
import type {
  DeliveryConfiguration,
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
} from '#src/libs/order/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { ShopListTab } from '#src/libs/shop/components/ShopListTabs/constants';
import type { OptionCallback } from '../../../../state/types';

type Props = {
  isLoading?: boolean;
  subshopList: SubShop[];
  supplierList: ShopSupplier[];
  supplierListCount: number;
  supplierListPage: number;
  provincialTax: number;
  deliveryConfiguration: DeliveryConfiguration;
  deliveryFees: DeliveryFee[];
  isOrderConfigurationLoading: boolean;
  isOrderConfigurationUpdateLoading: boolean;
  tagList: Tag<TagGroupAPI>[];
  retrieveShopItemUsedInCombo: (id: number) => void;
  getIsShopItemUsedInCombo: (id: number) => boolean;
  goToShopItem: (id: number) => void;
  createShopItem: (
    values: ShopItemCreate,
    subshopId: number,
    options: OptionCallback<ShopItem>,
  ) => void;
  deleteShopItem: (id: number) => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  handleChangeTab: (tab: ShopListTab) => void;
  createSupplier: (
    values: ShopSupplierCreate,
    options?: OptionCallback<ShopSupplier>,
  ) => void;
  updateSupplier: (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplier>,
  ) => void;
  deleteSupplier: (id: number, options: OptionCallback<number>) => void;
  createSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  updateSubshop: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => void;
  deleteSubshop: (id: number, options?: OptionCallback<number>) => void;
  createOrUpdateDeliveryFee: (data: DeliveryFeeCreationOrUpdatePayload) => void;
  patchDeliveryFee: (data: DeliveryConfiguration) => void;
  disableDeliveryFee: (deliveryFee: DeliveryFee) => void;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  changeSupplierPage: (
    page: number,
    options?: OptionCallback<ShopSupplier[]>,
  ) => void;
  checkBarcodeUnicity: (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => void;
  getShopItemBarcodeUnicity: (barcode: string) => boolean;
};

const ShopListReworked: React.FC<Props> = ({
  isLoading,
  subshopList,
  supplierList,
  supplierListCount,
  supplierListPage,
  provincialTax,
  deliveryConfiguration,
  deliveryFees,
  isOrderConfigurationLoading,
  isOrderConfigurationUpdateLoading,
  tagList,
  retrieveShopItemUsedInCombo,
  getIsShopItemUsedInCombo,
  goToShopItem,
  createShopItem,
  deleteShopItem,
  duplicateShopItem,
  handleChangeTab,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createSubshop,
  updateSubshop,
  deleteSubshop,
  createOrUpdateDeliveryFee,
  patchDeliveryFee,
  disableDeliveryFee,
  bookkeepingAccounts,
  bookkeepingAccountById,
  changeSupplierPage,
  checkBarcodeUnicity,
  getShopItemBarcodeUnicity,
}) => {
  const { t } = useTranslation('shop');

  const [isItemCreationDrawerOpen, setIsItemCreationDrawerOpen] =
    useState(false);

  const [selectedSubshopId, setSelectedSubshopId] = useState<number | null>(
    null,
  );

  const [shopItemToDelete, setShopItemToDelete] = useState<ShopItem | null>(
    null,
  );

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [isSupplierDeleteModalOpen, setIsSupplierDeleteModalOpen] =
    useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<null | ShopSupplier>(
    null,
  );

  const [selectedDeliveryFee, setSelectedDeliveryFee] =
    useState<null | DeliveryFee>(null);

  const classes = useStyles();

  const [isDeliveryFeeModalOpen, setIsDeliveryFeeModalOpen] = useState(false);

  const handleOpenDeliveryFeeModal = useCallback(
    () => setIsDeliveryFeeModalOpen(true),
    [],
  );

  const handleCloseDeliveryFeeModal = useCallback(() => {
    setIsDeliveryFeeModalOpen(false);
    setSelectedDeliveryFee(null);
  }, []);

  const handleEditDeliveryFee = useCallback(
    (deliveryFee: DeliveryFee) => {
      setSelectedDeliveryFee(deliveryFee);
      handleOpenDeliveryFeeModal();
    },
    [handleOpenDeliveryFeeModal],
  );

  const handleOpenSupplierDeleteModal = useCallback(
    () => setIsSupplierDeleteModalOpen(true),
    [],
  );

  const handleOpenSupplierModal = useCallback(
    () => setIsSupplierModalOpen(true),
    [],
  );

  const handleUnsetSupplier = useCallback(() => setSelectedSupplier(null), []);

  const handleCloseSupplierModal = useCallback(() => {
    setIsSupplierModalOpen(false);
    handleUnsetSupplier();
  }, [handleUnsetSupplier]);

  const handleSupplierSubmit = useCallback(
    (values: ShopListSettingsSupplierValues, hasInitial?: boolean) => {
      if (hasInitial) {
        updateSupplier(values as ShopSupplierUpdate, {
          onSuccess: () => {
            handleCloseSupplierModal();
            handleUnsetSupplier();
          },
        });
      } else {
        createSupplier(values as ShopSupplierCreate, {
          onSuccess: () => {
            handleCloseSupplierModal();
          },
        });
      }
    },
    [
      updateSupplier,
      handleCloseSupplierModal,
      handleUnsetSupplier,
      createSupplier,
    ],
  );

  const handleCloseSupplierDeleteModal = useCallback(() => {
    setIsSupplierDeleteModalOpen(false);
    handleUnsetSupplier();
  }, [handleUnsetSupplier]);

  const handleDeleteSupplier = useCallback(() => {
    deleteSupplier(selectedSupplier?.id, {
      onSuccess: () => {
        handleCloseSupplierDeleteModal();
      },
    });
  }, [deleteSupplier, handleCloseSupplierDeleteModal, selectedSupplier?.id]);

  const handleSelectSupplierForDeletion = useCallback(
    (supplier: ShopSupplier) => {
      setSelectedSupplier(supplier);
      handleOpenSupplierDeleteModal();
    },
    [handleOpenSupplierDeleteModal],
  );

  const handleEditSupplier = useCallback(
    (supplier: ShopSupplier) => {
      setSelectedSupplier(supplier);
      handleOpenSupplierModal();
    },
    [handleOpenSupplierModal],
  );

  const handleOpenItemCreationDrawer = useCallback(
    () => setIsItemCreationDrawerOpen(true),
    [],
  );

  const handleCloseItemCreationDrawer = useCallback(() => {
    setIsItemCreationDrawerOpen(false);
    setSelectedSubshopId(null);
  }, []);

  const handleCancelDeleteShopItem = useCallback(
    () => setShopItemToDelete(null),
    [],
  );

  const handleDeleteShopItem = useCallback(() => {
    deleteShopItem(shopItemToDelete?.id);
    setShopItemToDelete(null);
  }, [deleteShopItem, shopItemToDelete?.id]);

  const handleCreateShopItem = useCallback(
    (values: ShopItemCreate) => {
      createShopItem(values, selectedSubshopId, {
        onSuccess: () => handleCloseItemCreationDrawer(),
      });
    },
    [createShopItem, handleCloseItemCreationDrawer, selectedSubshopId],
  );

  const handleSetSelectedSubshopId = useCallback((id: number) => {
    setSelectedSubshopId(id);
  }, []);

  const handleSetShopItemToDelete = useCallback(
    (shopItem: ShopItem) => {
      retrieveShopItemUsedInCombo(shopItem.id);
      setShopItemToDelete(shopItem);
    },
    [retrieveShopItemUsedInCombo],
  );

  return (
    <div className={classes.container}>
      {isLoading && <LinearProgress />}
      <ShopListTabs
        changeSupplierPage={changeSupplierPage}
        createSubshop={createSubshop}
        deleteSubshop={deleteSubshop}
        deliveryConfiguration={deliveryConfiguration}
        deliveryFees={deliveryFees}
        disableDeliveryFee={disableDeliveryFee}
        duplicateShopItem={duplicateShopItem}
        goToShopItem={goToShopItem}
        handleChangeTab={handleChangeTab}
        handleEditDeliveryFee={handleEditDeliveryFee}
        handleEditSupplier={handleEditSupplier}
        handleOpenDeliveryFeeModal={handleOpenDeliveryFeeModal}
        handleOpenSupplierModal={handleOpenSupplierModal}
        handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
        isOrderConfigurationLoading={isOrderConfigurationLoading}
        isOrderConfigurationUpdateLoading={isOrderConfigurationUpdateLoading}
        openItemCreationDrawer={handleOpenItemCreationDrawer}
        patchDeliveryFee={patchDeliveryFee}
        setSelectedSubshopId={handleSetSelectedSubshopId}
        setShopItemToDelete={handleSetShopItemToDelete}
        subshopList={subshopList}
        supplierList={supplierList}
        supplierListCount={supplierListCount}
        supplierListPage={supplierListPage}
        updateSubshop={updateSubshop}
      />

      <GenericResponsiveDrawer
        onClose={handleCloseItemCreationDrawer}
        open={selectedSubshopId && isItemCreationDrawerOpen}
        title={t('shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          bookkeepingAccountById={bookkeepingAccountById}
          bookkeepingAccounts={bookkeepingAccounts}
          checkBarcodeUnicity={checkBarcodeUnicity}
          getShopItemBarcodeUnicity={getShopItemBarcodeUnicity}
          isLoading={isLoading}
          onCancel={handleCloseItemCreationDrawer}
          onCreateSubmit={handleCreateShopItem}
          provincialTax={provincialTax}
          supplierList={supplierList}
          tagList={tagList}
        />
      </GenericResponsiveDrawer>

      <ShopItemDeleteConfirmDialog
        isUsedInCombo={getIsShopItemUsedInCombo(shopItemToDelete?.id)}
        onCancel={handleCancelDeleteShopItem}
        onSubmit={handleDeleteShopItem}
        open={!!shopItemToDelete}
        shopItemName={shopItemToDelete?.name}
      />

      <ShopListSettingsSupplierModal
        handleCancel={handleCloseSupplierModal}
        handleSubmit={handleSupplierSubmit}
        initial={selectedSupplier}
        open={isSupplierModalOpen}
      />

      <ShopSupplierDeleteConfirmModal
        onCancel={handleCloseSupplierDeleteModal}
        onSubmit={handleDeleteSupplier}
        open={isSupplierDeleteModalOpen}
        supplierName={selectedSupplier?.name}
      />

      <DeliveryFeeDialogForm
        deliveryFee={selectedDeliveryFee}
        onClose={handleCloseDeliveryFeeModal}
        onSubmit={createOrUpdateDeliveryFee}
        open={isDeliveryFeeModalOpen}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
}));

export default React.memo(ShopListReworked);
