import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemDeleteConfirmDialog from '#libs/shop/components/ShopItemDeleteConfirmDialog.component';
import ShopItemFormReworked from '#libs/shop/components/ShopItemFormReworked';
import ShopListSettingsSupplierModal from '#libs/shop/components/ShopListSettingsSupplierModal';
import ShopListTabs from '#libs/shop/components/ShopListTabs';
import ShopSupplierDeleteConfirmModal from '#libs/shop/components/ShopSupplierDeleteConfirmModal';

import type {
  ShopItem,
  ShopItemCreate,
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierUpdate,
  SubShop,
} from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { ShopListSettingsSupplierValues } from '#libs/shop/components/ShopListSettingsSupplierModal/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';

type Props = {
  isLoading?: boolean;
  subshopList: SubShop[];
  supplierList: ShopSupplier[];
  provincialTax: number;
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
};

const ShopListReworked: React.FC<Props> = ({
  isLoading,
  subshopList,
  supplierList,
  provincialTax,
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

  const classes = useStyles();

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
          onSuccess: handleCloseSupplierModal,
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
      onSuccess: handleCloseSupplierDeleteModal,
    });
  }, [deleteSupplier, handleCloseSupplierDeleteModal, selectedSupplier?.id]);

  const handleSelectSupplierForDeletion = useCallback(
    (supplier: ShopSupplier) => () => {
      setSelectedSupplier(supplier);
      handleOpenSupplierDeleteModal();
    },
    [handleOpenSupplierDeleteModal],
  );

  const handleEditSupplier = useCallback(
    (supplier: ShopSupplier) => () => {
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
        createSubshop={createSubshop}
        deleteSubshop={deleteSubshop}
        duplicateShopItem={duplicateShopItem}
        goToShopItem={goToShopItem}
        handleChangeTab={handleChangeTab}
        handleEditSupplier={handleEditSupplier}
        handleOpenSupplierModal={handleOpenSupplierModal}
        handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
        openItemCreationDrawer={handleOpenItemCreationDrawer}
        setSelectedSubshopId={handleSetSelectedSubshopId}
        setShopItemToDelete={handleSetShopItemToDelete}
        subshopList={subshopList}
        supplierList={supplierList}
        updateSubshop={updateSubshop}
      />

      <GenericResponsiveDrawer
        onClose={handleCloseItemCreationDrawer}
        open={selectedSubshopId && isItemCreationDrawerOpen}
        title={t('shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          isLoading={isLoading}
          onCancel={handleCloseItemCreationDrawer}
          onCreateSubmit={handleCreateShopItem}
          provincialTax={provincialTax}
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
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
}));

export default React.memo(ShopListReworked);
