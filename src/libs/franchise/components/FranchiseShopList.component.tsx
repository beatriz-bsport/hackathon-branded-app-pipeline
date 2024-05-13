import React, { useCallback, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import FranchiseShopListTabs from './FranchiseShopListTabs.component';
import ShopListSettingsSupplierModal from '#src/libs/shop/components/ShopListSettingsSupplierModal';
import ShopSupplierDeleteConfirmModal from '#src/libs/shop/components/ShopSupplierDeleteConfirmModal';

import type {
  ShopItemTemplate,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopSupplierUpdate,
  SubshopTemplate,
} from '#src/libs/shop/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type { ShopListSettingsSupplierValues } from '#src/libs/shop/components/ShopListSettingsSupplierModal/types';

type Props = {
  isLoading?: boolean;
  subshopTemplateList: SubshopTemplate[];
  supplierTemplateList: ShopSupplierTemplate[];
  supplierTemplateListPage: number;
  supplierTemplateListCount: number;
  isSupplierTemplateListLoading?: boolean;
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
};

const FranchiseShopList: React.FC<Props> = ({
  isLoading,
  subshopTemplateList,
  supplierTemplateList,
  supplierTemplateListPage,
  supplierTemplateListCount,
  isSupplierTemplateListLoading,
  getShopItemTemplateState,
  createSubshopTemplate,
  updateSubshopTemplate,
  deleteSubshopTemplate,
  fetchShopItemTemplateList,
  createSupplierTemplate,
  updateSupplierTemplate,
  deleteSupplierTemplate,
  changeSupplierTemplatePage,
}) => {
  const classes = useStyles();

  const [isSupplierTemplateModalOpen, setIsSupplierTemplateModalOpen] =
    useState(false);

  const [
    isSupplierTemplateDeleteModalOpen,
    setIsSupplierTemplateDeleteModalOpen,
  ] = useState(false);

  const [selectedSupplierTemplate, setSelectedSupplierTemplate] =
    useState<null | ShopSupplierTemplate>(null);

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

  return (
    <div className={classes.container}>
      {isLoading && <LinearProgress />}
      <FranchiseShopListTabs
        changeSupplierTemplatePage={changeSupplierTemplatePage}
        createSubshopTemplate={createSubshopTemplate}
        deleteSubshopTemplate={deleteSubshopTemplate}
        fetchShopItemTemplateList={fetchShopItemTemplateList}
        getShopItemTemplateState={getShopItemTemplateState}
        handleEditSupplierTemplate={handleEditSupplierTemplate}
        handleOpenSupplierTemplateModal={handleOpenSupplierTemplateModal}
        handleSelectSupplierTemplateForDeletion={handleDeleteSupplierTemplate}
        isSupplierTemplateListLoading={isSupplierTemplateListLoading}
        subshopTemplateList={subshopTemplateList}
        supplierTemplateList={supplierTemplateList}
        supplierTemplateListCount={supplierTemplateListCount}
        supplierTemplateListPage={supplierTemplateListPage}
        updateSubshopTemplate={updateSubshopTemplate}
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
