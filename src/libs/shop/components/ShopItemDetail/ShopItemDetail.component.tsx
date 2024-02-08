import React, { useState, useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import ShopItemFormReworked from '#libs/shop/components/ShopItemFormReworked';
import ShopItemDetailProductCard from '#libs/shop/components/ShopItemDetailProductCard';
import ShopItemDeleteConfirmDialog from '#libs/shop/components/ShopItemDeleteConfirmDialog.component';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

import type { ShopItem, ShopItemCreate, ShopItemEdit } from '#libs/shop/types';
import type { OptionCallback } from '../../../../state/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);

type Props = {
  isShopItemUsedInCombo?: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
  provincialTaxValue: number;
  shopItem: ShopItem;
  updateShopItem: (
    formData: Partial<ShopItemEdit>,
    id: number,
    options: OptionCallback<ShopItem>,
  ) => void;
  deleteShopItem: () => void;
};

const ShopItemDetail: React.FC<Props> = ({
  isShopItemUsedInCombo,
  isLoading,
  isDeleting,
  provincialTaxValue,
  shopItem,
  updateShopItem,
  deleteShopItem,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

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

  return (
    <div className={classes.container}>
      <ShopItemDetailProductCard
        cover={shopItem?.cover}
        description={shopItem?.description}
        isDeleting={isDeleting}
        isLoading={isLoading}
        lowestVariantPrice={shopItem?.lowest_variant_price}
        name={shopItem?.name}
        onDeleteShopItem={handleOpenDeleteConfirmationModal}
        onEditShopItem={handleOpenEditShopItemDrawer}
        price={shopItem?.price}
        subtitle={shopItem?.subtitle}
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

      <ShopItemDeleteConfirmDialog
        isUsedInCombo={isShopItemUsedInCombo}
        onCancel={handleCloseDeleteConfirmationModal}
        onSubmit={deleteShopItem}
        open={showDeleteConfirmationModal}
        shopItemName={shopItem?.name ?? ''}
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
