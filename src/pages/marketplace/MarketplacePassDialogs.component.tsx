import React, { useCallback } from 'react';

import MarketplacePaymentPackDetailsModal from '#libs/marketplace/components/MarketplacePaymentPackDetailModal';
import MarketplacePaymentPackRestrictionModal from '#libs/marketplace/components/MarketplacePaymentPackRestrictionModal';
import MarketplacePaymentPackCompatibilityModal from '#libs/marketplace/components/MarketplacePaymentPackCompatibilityModal';
import MarketplacePrivatePassDetailsModal from '#libs/marketplace/components/MarketplacePrivatePassDetailsModal';
import MarketplacePrivatePassCompatibilityModal from '#libs/marketplace/components/MarketplacePrivatePassCompatibilityModal';
import MarketplacePaymentComboDetailsModal from '#libs/marketplace/components/MarketplacePaymentComboDetailModal';
import {
  MarketplacePassDialogStateKey,
  MarketplacePassPagePaymentPack,
  MarketplacePassPagePrivatePass,
  MarketplacePassPageDialogState,
} from '#libs/marketplace/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  dialogSelectedItem:
    | (PaymentPack | MarketplacePassPagePrivatePass | PaymentCombo)
    | null;
  isPaymentPackDetailsDialogOpen: boolean;
  isPaymentPackCompatibilityDialogOpen: boolean;
  isPaymentPackRestrictionDialogOpen: boolean;
  isPrivatePassDetailsDialogOpen: boolean;
  isPrivatePassCompatibilityDialogOpen: boolean;
  isPaymentComboDetailsDialogOpen: boolean;
  isExcludingTax: boolean;
  addPaymentPackToCart: (packId: number) => void;
  addPrivatePassToCart: (packId: number) => void;
  addComboToCart: (comboId: number) => void;
  handleCloseDialog: (key: MarketplacePassDialogStateKey) => void;
  handleOpenDialog: (
    key: string,
    selectedItem?: PaymentPack | MarketplacePassPagePrivatePass | PaymentCombo,
  ) => void;
};

const MarketplacePassDialogs = (props: Props) => {
  const {
    dialogSelectedItem,
    isPaymentPackDetailsDialogOpen,
    isPaymentPackCompatibilityDialogOpen,
    isPaymentPackRestrictionDialogOpen,
    isPrivatePassDetailsDialogOpen,
    isPrivatePassCompatibilityDialogOpen,
    isPaymentComboDetailsDialogOpen,
    isExcludingTax,
    addPaymentPackToCart,
    addPrivatePassToCart,
    addComboToCart,
    handleCloseDialog,
    handleOpenDialog,
  } = props;

  const handleOpenPrivatePassCompatibilityDialog = useCallback(() => {
    handleOpenDialog(MarketplacePassPageDialogState.PrivatePassCompatibility);
  }, [handleOpenDialog]);

  const handleOpenPaymentPackRestrictionDialog = useCallback(() => {
    handleOpenDialog(MarketplacePassPageDialogState.PaymentPackRestriction);
  }, [handleOpenDialog]);

  const handleOpenPaymentPackCompatibilityDialog = useCallback(() => {
    handleOpenDialog(MarketplacePassPageDialogState.PaymentPackCompatibility);
  }, [handleOpenDialog]);

  const handleClosePaymentPackDetailsDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PaymentPackDetail);
  }, [handleCloseDialog]);

  const handleClosePaymentPackRestrictionDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PaymentPackRestriction);
  }, [handleCloseDialog]);

  const handleClosePaymentPackCompatibilityDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PaymentPackCompatibility);
  }, [handleCloseDialog]);

  const handleClosePrivatePassDetailsDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PrivatePassDetail);
  }, [handleCloseDialog]);

  const handleClosePrivatePassCompatibilityDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PrivatePassCompatibility);
  }, [handleCloseDialog]);

  const handleClosePaymentComboDetailsDialog = useCallback(() => {
    handleCloseDialog(MarketplacePassPageDialogState.PaymentComboDetail);
  }, [handleCloseDialog]);

  const handleAddToCart = useCallback(
    () => dialogSelectedItem && addComboToCart(dialogSelectedItem.id),
    [addComboToCart, dialogSelectedItem],
  );

  return (
    <>
      <MarketplacePaymentPackDetailsModal
        paymentPack={dialogSelectedItem as PaymentPack}
        isOpen={isPaymentPackDetailsDialogOpen}
        onAddToCart={addPaymentPackToCart}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onDialogClose={handleClosePaymentPackDetailsDialog}
        onShowRestrictionDialog={handleOpenPaymentPackRestrictionDialog}
        onShowCompatibilityDialog={handleOpenPaymentPackCompatibilityDialog}
      />

      <MarketplacePaymentPackRestrictionModal
        paymentPack={dialogSelectedItem as PaymentPack}
        isOpen={isPaymentPackRestrictionDialogOpen}
        onDialogClose={handleClosePaymentPackRestrictionDialog}
      />

      <MarketplacePaymentPackCompatibilityModal
        categories={
          (dialogSelectedItem as MarketplacePassPagePaymentPack)?.categories ??
          []
        }
        metaActivities={
          (dialogSelectedItem as MarketplacePassPagePaymentPack)
            ?.metaActivities ?? []
        }
        establishments={
          (dialogSelectedItem as MarketplacePassPagePaymentPack)
            ?.establishments ?? []
        }
        isOpen={isPaymentPackCompatibilityDialogOpen}
        onDialogClose={handleClosePaymentPackCompatibilityDialog}
      />

      <MarketplacePrivatePassDetailsModal
        privatePass={dialogSelectedItem as MarketplacePassPagePrivatePass}
        isOpen={isPrivatePassDetailsDialogOpen}
        onDialogClose={handleClosePrivatePassDetailsDialog}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onAddToCart={addPrivatePassToCart}
        onShowCompatibilityDialog={handleOpenPrivatePassCompatibilityDialog}
      />

      <MarketplacePrivatePassCompatibilityModal
        compatiblePrivateServices={
          (dialogSelectedItem as MarketplacePassPagePrivatePass)
            ?.private_services ?? []
        }
        isOpen={isPrivatePassCompatibilityDialogOpen}
        onDialogClose={handleClosePrivatePassCompatibilityDialog}
      />

      <MarketplacePaymentComboDetailsModal
        paymentCombo={dialogSelectedItem as PaymentCombo}
        isOpen={isPaymentComboDetailsDialogOpen}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onDialogClose={handleClosePaymentComboDetailsDialog}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};
export default MarketplacePassDialogs;
