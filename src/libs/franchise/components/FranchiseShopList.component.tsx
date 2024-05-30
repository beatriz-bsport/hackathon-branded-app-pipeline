import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import FranchiseShopListTabs from './FranchiseShopListTabs.component';
import ShopListSettingsSupplierModal from '#libs/shop/components/ShopListSettingsSupplierModal';
import ShopSupplierDeleteConfirmModal from '#libs/shop/components/ShopSupplierDeleteConfirmModal';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemFormReworked from '#libs/shop/components/ShopItemFormReworked';
import ShopItemDeleteConfirmDialog from '#libs/shop/components/ShopItemDeleteConfirmDialog.component';

import type {
  ShopItemCreate,
  ShopItemTemplate,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopSupplierUpdate,
  SubshopTemplate,
} from '#libs/shop/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { ErrorAndLoading } from '#libs/types';
import type { ShopListSettingsSupplierValues } from '#libs/shop/components/ShopListSettingsSupplierModal/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

type Props = {
  isLoading?: boolean;
  subshopTemplateList: SubshopTemplate[];
  supplierTemplateList: ShopSupplierTemplate[];
  supplierTemplateListPage: number;
  supplierTemplateListCount: number;
  isSupplierTemplateListLoading?: boolean;
  goToShopItemTemplate: (shopItemTemplateId: number) => void;
  getShopItemTemplateState: (
    subshopTemplateId: number,
  ) => ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
  createSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  updateSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  deleteSubshopTemplate: (id: number, options?: OptionCallback<number>) => void;
  fetchShopItemTemplateList: (
    subshopTemplateId: number,
    page?: number,
    options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
  ) => void;
  createSupplierTemplate: (
    values: ShopSupplierTemplateCreate,
    options?: OptionCallback<ShopSupplierTemplate>,
  ) => void;
  updateSupplierTemplate: (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplierTemplate>,
  ) => void;
  deleteSupplierTemplate: (id: number, options: OptionCallback<number>) => void;
  changeSupplierTemplatePage: (page: number) => void;
  createShopItemTemplate: (
    values: ShopItemCreate,
    subshopTemplateId: number,
    options?: OptionCallback,
  ) => void;
  deleteShopItemTemplate: (
    id: number,
    subshopTemplateId: number,
    options?: OptionCallback<number>,
  ) => void;
};

const FranchiseShopList: React.FC<Props> = ({
  isLoading,
  subshopTemplateList,
  supplierTemplateList,
  supplierTemplateListPage,
  supplierTemplateListCount,
  isSupplierTemplateListLoading,
  goToShopItemTemplate,
  getShopItemTemplateState,
  createSubshopTemplate,
  updateSubshopTemplate,
  deleteSubshopTemplate,
  fetchShopItemTemplateList,
  createSupplierTemplate,
  updateSupplierTemplate,
  deleteSupplierTemplate,
  changeSupplierTemplatePage,
  createShopItemTemplate,
  deleteShopItemTemplate,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const [isSupplierTemplateModalOpen, setIsSupplierTemplateModalOpen] =
    useState(false);

  const [
    isSupplierTemplateDeleteModalOpen,
    setIsSupplierTemplateDeleteModalOpen,
  ] = useState(false);

  const [isShopItemTemplateFormOpen, setIsShopItemTemplateFormOpen] =
    useState(false);

  const [selectedSubshopTemplateId, setSelectedSubshopTemplateId] = useState<
    number | null
  >(null);

  const [selectedSupplierTemplate, setSelectedSupplierTemplate] =
    useState<null | ShopSupplierTemplate>(null);

  const [shopItemTemplateToDelete, setShopItemTemplateToDelete] =
    useState<ShopItemTemplate | null>(null);

  const handleOpenSupplierTemplateModal = useCallback(
    () => setIsSupplierTemplateModalOpen(true),
    [],
  );

  const handleUnsetSupplierTemplate = useCallback(
    () => setSelectedSupplierTemplate(null),
    [],
  );

  const handleCloseSupplierTemplateModal = useCallback(() => {
    setIsSupplierTemplateModalOpen(false);
    handleUnsetSupplierTemplate();
  }, [handleUnsetSupplierTemplate]);

  const handleCloseSupplierTemplateDeleteModal = useCallback(() => {
    setIsSupplierTemplateDeleteModalOpen(false);
    handleUnsetSupplierTemplate();
  }, [handleUnsetSupplierTemplate]);

  const handleDeleteSupplier = useCallback(() => {
    deleteSupplierTemplate(selectedSupplierTemplate?.id, {
      onSuccess: () => {
        handleCloseSupplierTemplateDeleteModal();
      },
    });
  }, [
    deleteSupplierTemplate,
    handleCloseSupplierTemplateDeleteModal,
    selectedSupplierTemplate?.id,
  ]);

  const handleOpenSupplierTemplateDeleteModal = useCallback(
    () => setIsSupplierTemplateDeleteModalOpen(true),
    [],
  );

  const handleOpenShopItemTemplateForm = useCallback(
    (subshopTemplateId: number) => {
      setSelectedSubshopTemplateId(subshopTemplateId);
      setIsShopItemTemplateFormOpen(true);
    },
    [],
  );

  const handleCloseShopItemTemplateForm = useCallback(() => {
    setSelectedSubshopTemplateId(null);
    setIsShopItemTemplateFormOpen(false);
  }, []);

  const handleDeleteSupplierTemplate = useCallback(
    (supplier: ShopSupplierTemplate) => {
      setSelectedSupplierTemplate(supplier);
      handleOpenSupplierTemplateDeleteModal();
    },
    [handleOpenSupplierTemplateDeleteModal],
  );

  const handleEditSupplierTemplate = useCallback(
    (supplier: ShopSupplierTemplate) => {
      setSelectedSupplierTemplate(supplier);
      handleOpenSupplierTemplateModal();
    },
    [handleOpenSupplierTemplateModal],
  );

  const handleSupplierSubmit = useCallback(
    (values: ShopListSettingsSupplierValues, hasInitial?: boolean) => {
      if (hasInitial) {
        updateSupplierTemplate(values as ShopSupplierUpdate, {
          onSuccess: () => {
            handleCloseSupplierTemplateModal();
            handleUnsetSupplierTemplate();
          },
        });
      } else {
        createSupplierTemplate(values as ShopSupplierTemplateCreate, {
          onSuccess: () => {
            handleCloseSupplierTemplateModal();
          },
        });
      }
    },
    [
      updateSupplierTemplate,
      handleCloseSupplierTemplateModal,
      handleUnsetSupplierTemplate,
      createSupplierTemplate,
    ],
  );

  const handleShopItemTemplateSubmit = useCallback(
    (values: ShopItemCreate) =>
      createShopItemTemplate(values, selectedSubshopTemplateId, {
        onSuccess: handleCloseShopItemTemplateForm,
      }),
    [
      createShopItemTemplate,
      handleCloseShopItemTemplateForm,
      selectedSubshopTemplateId,
    ],
  );

  const handleSetShopItemTemplateToDelete = useCallback(
    (shopItemTemplate: ShopItemTemplate, subshopTemplateId: number) => {
      // retrieveShopItemUsedInCombo(shopItem.id);
      setSelectedSubshopTemplateId(subshopTemplateId);
      setShopItemTemplateToDelete(shopItemTemplate);
    },
    [],
  );

  const handleCancelDeleteShopItemTemplate = useCallback(() => {
    setSelectedSubshopTemplateId(null);
    setShopItemTemplateToDelete(null);
  }, []);

  const onDeleteShopItemTemplate = useCallback(() => {
    deleteShopItemTemplate(
      shopItemTemplateToDelete?.id,
      selectedSubshopTemplateId,
      { onSuccess: handleCancelDeleteShopItemTemplate },
    );
  }, [
    deleteShopItemTemplate,
    handleCancelDeleteShopItemTemplate,
    selectedSubshopTemplateId,
    shopItemTemplateToDelete?.id,
  ]);

  return (
    <div className={classes.container}>
      {isLoading && <LinearProgress />}
      <FranchiseShopListTabs
        changeSupplierTemplatePage={changeSupplierTemplatePage}
        createSubshopTemplate={createSubshopTemplate}
        deleteSubshopTemplate={deleteSubshopTemplate}
        fetchShopItemTemplateList={fetchShopItemTemplateList}
        getShopItemTemplateState={getShopItemTemplateState}
        goToShopItemTemplate={goToShopItemTemplate}
        handleEditSupplierTemplate={handleEditSupplierTemplate}
        handleOpenShopItemTemplateForm={handleOpenShopItemTemplateForm}
        handleOpenSupplierTemplateModal={handleOpenSupplierTemplateModal}
        handleSelectSupplierTemplateForDeletion={handleDeleteSupplierTemplate}
        handleSetShopItemTemplateToDelete={handleSetShopItemTemplateToDelete}
        isSupplierTemplateListLoading={isSupplierTemplateListLoading}
        subshopTemplateList={subshopTemplateList}
        supplierTemplateList={supplierTemplateList}
        supplierTemplateListCount={supplierTemplateListCount}
        supplierTemplateListPage={supplierTemplateListPage}
        updateSubshopTemplate={updateSubshopTemplate}
      />

      <GenericResponsiveDrawer
        onClose={handleCloseShopItemTemplateForm}
        open={selectedSubshopTemplateId && isShopItemTemplateFormOpen}
        title={t('shopitem.form.title')}
        trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.ShopItem}
      >
        <ShopItemFormReworked
          bookkeepingAccountById={{}} // TEMP - tackled in https://bsporttest.atlassian.net/browse/BS-4055
          bookkeepingAccounts={[]} // TEMP - tackled in https://bsporttest.atlassian.net/browse/BS-4055
          isLoading={isLoading}
          onCancel={handleCloseShopItemTemplateForm}
          onCreateSubmit={handleShopItemTemplateSubmit}
          supplierList={supplierTemplateList}
        />
      </GenericResponsiveDrawer>

      <ShopItemDeleteConfirmDialog
        onCancel={handleCancelDeleteShopItemTemplate}
        onSubmit={onDeleteShopItemTemplate}
        open={!!shopItemTemplateToDelete && !!selectedSubshopTemplateId}
        shopItemName={shopItemTemplateToDelete?.name}
      />

      <ShopListSettingsSupplierModal
        handleCancel={handleCloseSupplierTemplateModal}
        handleSubmit={handleSupplierSubmit}
        initial={selectedSupplierTemplate}
        open={isSupplierTemplateModalOpen}
      />

      <ShopSupplierDeleteConfirmModal
        onCancel={handleCloseSupplierTemplateDeleteModal}
        onSubmit={handleDeleteSupplier}
        open={isSupplierTemplateDeleteModalOpen}
        supplierName={selectedSupplierTemplate?.name}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
}));

export default React.memo(FranchiseShopList);
