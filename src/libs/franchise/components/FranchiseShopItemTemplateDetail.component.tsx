import React, { useState, useCallback, useMemo, useEffect } from 'react';

import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme, useMediaQuery, Theme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';

import ShopItemFormReworked from '#src/libs/shop/components/ShopItemFormReworked';

import FranchiseShopItemTemplateDetailTabs from './FranchiseShopItemTemplateDetailTabs.component';
import ShopItemVariantForm from '#src/libs/shop/components/ShopItemVariantForm';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

import ShopItemDetailProductCard from '#src/libs/shop/components/ShopItemDetailProductCard';
import ShopItemDeleteConfirmDialog from '#src/libs/shop/components/ShopItemDeleteConfirmDialog.component';

import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { ShopModalContextProvider } from '#src/hocs/shop-modal-prompt.hoc';

import type {
  ShopItemTemplate,
  TabListOption,
  ShopItemEdit,
  ShopSupplierTemplate,
  ShopItem,
  ProvisionCreate,
  Provision,
  ProvisionBulkCreate,
  ShopItemVariantAttributes,
} from '#src/libs/shop/types';
import type { OptionCallback } from '#src/state/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  tab?: string;
  isLoading?: boolean;
  isDeleting?: boolean;
  isVariantListLoading?: boolean;
  isDeletingVariant?: boolean;
  isUpdatingVariant?: boolean;
  provincialTaxValue: number;
  shopItemTemplate: ShopItemTemplate;
  supplierTemplateList: ShopSupplierTemplate[];
  variantList: ShopItemTemplate[];
  variantInstanceList: ShopItem[];
  page: number;
  count: number;
  shopItemVariantFilterOptionList: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  shopItemVariantFilterOptionValues: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  shopItemTemplateSupplierName?: string;
  updateShopItemTemplate: (
    formData: ShopItemEdit,
    options?: OptionCallback,
  ) => void;
  deleteShopItemTemplate: () => void;
  deleteShopItemTemplateVariant: (id: number) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes',
  ) => (options: SelectOption[]) => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  updateShopItemTemplateVariantBulk: (
    data: FormData,
    options?: OptionCallback,
  ) => void;
  createShopItemTemplateVariants: (
    baseItemTemplateId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback,
  ) => void;
  setQueryParam: (queryParam: string) => (value: string) => void;
};

const FranchiseShopItemTemplateDetail: React.FC<Props> = ({
  tab,
  isLoading,
  isDeleting,
  isVariantListLoading,
  isUpdatingVariant,
  isDeletingVariant,
  provincialTaxValue,
  shopItemTemplate,
  variantList,
  supplierTemplateList,
  variantInstanceList,
  page,
  count,
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  shopItemTemplateSupplierName,
  updateShopItemTemplate,
  deleteShopItemTemplate,
  deleteShopItemTemplateVariant,
  changeInventoryVariantFilter,
  createShopItemProvision,
  createShopItemProvisionBulk,
  updateShopItemTemplateVariantBulk,
  createShopItemTemplateVariants,
  setQueryParam,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isMobile });

  const { t } = useTranslation('shop');

  const [isCreateVariantDrawerOpen, setIsCreateVariantDrawerOpen] =
    useState(false);

  const [selectedVariantBarcode, setSelectedVariantBarcode] = useState<
    string | null
  >(null);

  const [selectedTab, setSelectedTab] = useState<TabListOption>({
    label: t('shop:shopItemDetail.tab.inventory'),
    value: ShopItemDetailTab.INVENTORY,
  });

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const availableTabListOptions: TabListOption[] = useMemo(
    () => [
      {
        label: t('shop:shopItemDetail.tab.inventory'),
        value: ShopItemDetailTab.INVENTORY,
      },
      {
        label: `${t('shop:shopItemDetail.tab.variants')}`,
        value: ShopItemDetailTab.VARIANTS,
      },
      {
        label: t('shop:shopItemDetail.tab.settings'),
        value: ShopItemDetailTab.SETTINGS,
      },
    ],
    [t],
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

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const [selectedVariantIdToDelete, setSelectedVariantIdToDelete] = useState<
    number | null
  >(null);

  const [
    showVariantDeleteConfirmationModal,
    setShowVariantDeleteConfirmationModal,
  ] = useState(false);

  const [isVariantEditMode, setIsVariantEditMode] = useState(false);

  const handleOpenDeleteConfirmationModal = useCallback(() => {
    setShowDeleteConfirmationModal(true);
  }, []);

  const handleCloseDeleteConfirmationModal = useCallback(() => {
    setShowDeleteConfirmationModal(false);
  }, []);

  const handleOpenCreateVariantDrawer = useCallback(
    () => setIsCreateVariantDrawerOpen(true),
    [],
  );

  const handleOpenEditShopItemDrawer = useCallback(
    () => setIsEditShopitemDrawerOpen(true),
    [],
  );

  const handleCloseEditShopItemDrawer = useCallback(
    () => setIsEditShopitemDrawerOpen(false),
    [],
  );

  const handleCloseCreateVariantDrawer = useCallback(
    () => setIsCreateVariantDrawerOpen(false),
    [],
  );

  const handleOpenBarcodeModal = useCallback((barcode: string) => {
    setSelectedVariantBarcode(barcode);
    setShowBarcodeModal(true);
  }, []);

  const handleCloseBarcodeModal = useCallback(() => {
    setShowBarcodeModal(false);
  }, []);

  const handleOpenDeleteVariantConfirmationModal = useCallback((id: number) => {
    setSelectedVariantIdToDelete(id);
    setShowVariantDeleteConfirmationModal(true);
  }, []);

  const handleCloseDeleteVariantConfirmationModal = useCallback(() => {
    setShowVariantDeleteConfirmationModal(false);
  }, []);

  const handleSubmitDeleteVariant = useCallback(() => {
    handleCloseDeleteVariantConfirmationModal();
    deleteShopItemTemplateVariant(selectedVariantIdToDelete);
  }, [
    deleteShopItemTemplateVariant,
    handleCloseDeleteVariantConfirmationModal,
    selectedVariantIdToDelete,
  ]);

  const handleSubmitEditShopItem = useCallback(
    (formData: ShopItemEdit) => {
      updateShopItemTemplate(formData, {
        onSuccess: () => {
          handleCloseEditShopItemDrawer();
          shopItemTemplate?.id && trackFormSuccess(shopItemTemplate?.id);
        },
      });
    },
    [
      handleCloseEditShopItemDrawer,
      shopItemTemplate?.id,
      updateShopItemTemplate,
    ],
  );

  const handleSubmitCreateVariant = useCallback(
    (formData: ShopItemVariantAttributes) => {
      createShopItemTemplateVariants(shopItemTemplate?.id, formData, {
        onSuccess: () => {
          handleCloseCreateVariantDrawer();
        },
      });
    },
    [
      createShopItemTemplateVariants,
      handleCloseCreateVariantDrawer,
      shopItemTemplate?.id,
    ],
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
        setQueryParam('page')('1');
      }
      isVariantEditMode && setIsVariantEditMode(false);
      setSelectedTab(option);
    },
    [isVariantEditMode, page, setQueryParam],
  );

  return (
    <div className={classes.container}>
      <ShopItemDetailProductCard
        hideCopyPaymentPageLink
        allVariantsHaveSamePrice={
          shopItemTemplate?.all_variants_follow_base_price
        }
        cover={shopItemTemplate?.cover}
        description={shopItemTemplate?.description}
        isDeleting={isDeleting}
        isLoading={isLoading}
        lowestVariantPrice={shopItemTemplate?.lowest_variant_price}
        name={shopItemTemplate?.name}
        onDeleteShopItem={handleOpenDeleteConfirmationModal}
        onEditShopItem={handleOpenEditShopItemDrawer}
        price={shopItemTemplate?.price}
        subtitle={shopItemTemplate?.subtitle}
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
        <FranchiseShopItemTemplateDetailTabs
          availableTabListOptions={availableTabListOptions}
          changeInventoryVariantFilter={changeInventoryVariantFilter}
          count={count}
          createShopItemProvision={createShopItemProvision}
          createShopItemProvisionBulk={createShopItemProvisionBulk}
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
          setQueryParam={setQueryParam}
          shopItemTemplate={shopItemTemplate}
          shopItemTemplateSupplierName={shopItemTemplateSupplierName}
          shopItemVariantFilterOptionList={shopItemVariantFilterOptionList}
          shopItemVariantFilterOptionValues={shopItemVariantFilterOptionValues}
          updateShopItemTemplateVariantBulk={updateShopItemTemplateVariantBulk} // handled in https://bsporttest.atlassian.net/browse/BS-4194
          variantCombinationListCount={count}
          variantInstanceList={variantInstanceList}
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
          initial={shopItemTemplate}
          isLoading={isLoading}
          onCancel={handleCloseEditShopItemDrawer}
          onUpdateSubmit={handleSubmitEditShopItem}
          provincialTax={provincialTaxValue}
          supplierList={supplierTemplateList}
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
          variantCombinationList={[]} // TODO https://bsporttest.atlassian.net/browse/BS-4194
        />
      </GenericResponsiveDrawer>

      <ShopItemDeleteConfirmDialog
        onCancel={handleCloseDeleteConfirmationModal}
        onSubmit={deleteShopItemTemplate}
        open={showDeleteConfirmationModal}
        shopItemName={shopItemTemplate?.name ?? ''}
      />

      <ShopItemDeleteConfirmDialog
        onCancel={handleCloseDeleteVariantConfirmationModal}
        onSubmit={handleSubmitDeleteVariant}
        open={showVariantDeleteConfirmationModal && !!selectedVariantIdToDelete}
      />

      <Dialog
        onClose={handleCloseBarcodeModal}
        open={showBarcodeModal && !!selectedVariantBarcode}
      >
        <Barcode background="#fafafa" value={selectedVariantBarcode} />
      </Dialog>
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

export default React.memo(FranchiseShopItemTemplateDetail);
