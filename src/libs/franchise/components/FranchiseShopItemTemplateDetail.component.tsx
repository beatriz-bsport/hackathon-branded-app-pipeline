import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme, useMediaQuery, Theme } from '@material-ui/core';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemFormReworked from '#libs/shop/components/ShopItemFormReworked';
import ShopItemDetailProductCard from '#libs/shop/components/ShopItemDetailProductCard';
import ShopItemDeleteConfirmDialog from '#libs/shop/components/ShopItemDeleteConfirmDialog.component';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

import type {
  ShopItemTemplate,
  TabListOption,
  ShopItemEdit,
  ShopSupplierTemplate,
} from '#libs/shop/types';
import type { OptionCallback } from '#state/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  tab?: string;
  isLoading?: boolean;
  isDeleting?: boolean;
  provincialTaxValue: number;
  shopItemTemplate: ShopItemTemplate;
  supplierTemplateList: ShopSupplierTemplate[];
  updateShopItemTemplate: (
    formData: ShopItemEdit,
    options?: OptionCallback,
  ) => void;
  deleteShopItemTemplate: () => void;
};

const FranchiseShopItemTemplateDetail: React.FC<Props> = ({
  tab,
  isLoading,
  isDeleting,
  provincialTaxValue,
  shopItemTemplate,
  supplierTemplateList,
  updateShopItemTemplate,
  deleteShopItemTemplate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isMobile });

  const { t } = useTranslation('shop');

  const [selectedTab, setSelectedTab] = useState<TabListOption>({
    label: t('shop:shopItemDetail.tab.inventory'),
    value: ShopItemDetailTab.INVENTORY,
  });

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

  return (
    <div className={classes.container}>
      <ShopItemDetailProductCard
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

      <ShopItemDeleteConfirmDialog
        onCancel={handleCloseDeleteConfirmationModal}
        onSubmit={deleteShopItemTemplate}
        open={showDeleteConfirmationModal}
        shopItemName={shopItemTemplate?.name ?? ''}
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

export default React.memo(FranchiseShopItemTemplateDetail);
