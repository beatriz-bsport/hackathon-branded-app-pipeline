import React, { useCallback, useMemo } from 'react';

import MarketplacePaymentPackDetailsModal from '#libs/marketplace/components/MarketplacePaymentPackDetailModal';
import MarketplacePaymentPackRestrictionModal from '#libs/marketplace/components/MarketplacePaymentPackRestrictionModal';
import MarketplacePaymentPackCompatibilityModal from '#libs/marketplace/components/MarketplacePaymentPackCompatibilityModal';
import MarketplacePrivatePassDetailsModal from '#libs/marketplace/components/MarketplacePrivatePassDetailsModal';
import MarketplacePrivatePassCompatibilityModal from '#libs/marketplace/components/MarketplacePrivatePassCompatibilityModal';
import MarketplacePaymentComboDetailsModal from '#libs/marketplace/components/MarketplacePaymentComboDetailModal';
import {
  MarketplacePassDialogStateKey,
  MarketplacePassPagePaymentPack,
  MarketplacePassPageDialogState,
} from '#libs/marketplace/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import {
  PrivatePass,
  PrivateService,
  PrivateSlot,
} from '#libs/private-service/types';

type Props = {
  dialogSelectedItem: (PaymentPack | PrivatePass | PaymentCombo) | null;
  isPaymentPackDetailsDialogOpen: boolean;
  isPaymentPackCompatibilityDialogOpen: boolean;
  isPaymentPackRestrictionDialogOpen: boolean;
  isPrivatePassDetailsDialogOpen: boolean;
  isPrivatePassCompatibilityDialogOpen: boolean;
  isPaymentComboDetailsDialogOpen: boolean;
  isExcludingTax: boolean;
  establishments: {
    [key: string]: Establishment;
  };
  metaActivities: {
    [key: string]: MetaActivity<number>;
  };
  privateServices: {
    [key: string]: PrivateService;
  };
  privateSlots: {
    [key: string]: PrivateSlot;
  };
  addPaymentPackToCart: (packId: number) => void;
  addPrivatePassToCart: (packId: number) => void;
  addComboToCart: (comboId: number) => void;
  handleCloseDialog: (key: MarketplacePassDialogStateKey) => void;
  handleOpenDialog: (
    key: string,
    selectedItem?: PaymentPack | PrivatePass | PaymentCombo,
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
    establishments,
    metaActivities,
    privateServices,
    privateSlots,
    addPaymentPackToCart,
    addPrivatePassToCart,
    addComboToCart,
    handleCloseDialog,
    handleOpenDialog,
  } = props;

  const paymentPackCompatibleEstablishments = useMemo(() => {
    if (
      dialogSelectedItem &&
      (dialogSelectedItem as PaymentPack).establishments
    ) {
      return Object.values(establishments).filter(
        (establishment: Establishment) =>
          (dialogSelectedItem as PaymentPack).establishments.includes(
            establishment.id,
          ),
      );
    }
    return null;
  }, [dialogSelectedItem, establishments]);

  const paymentPackCompatibleActivities = useMemo(() => {
    if (
      dialogSelectedItem &&
      (dialogSelectedItem as PaymentPack).metaActivities
    ) {
      return Object.values(metaActivities).filter(
        (metaActivity: MetaActivity) =>
          (dialogSelectedItem as PaymentPack).metaActivities.includes(
            metaActivity.id,
          ),
      );
    }
    return null;
  }, [dialogSelectedItem, metaActivities]);

  const privatePassCompatibleServices = useMemo(() => {
    if (
      dialogSelectedItem &&
      (dialogSelectedItem as PrivatePass).private_services
    ) {
      return Object.values(privateServices)
        .filter((privateService) =>
          (dialogSelectedItem as PrivatePass).private_services.includes(
            privateService.id,
          ),
        )
        .map((privateService) => {
          return {
            ...privateService,
            slots: privateService.slots.map((slot) => privateSlots[slot]),
          };
        })
        .filter((privateService) => privateService.slots.length);
    }
    return null;
  }, [dialogSelectedItem, privateServices, privateSlots]);

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
        isOpen={isPaymentPackDetailsDialogOpen && !!dialogSelectedItem}
        onAddToCart={addPaymentPackToCart}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onDialogClose={handleClosePaymentPackDetailsDialog}
        onShowRestrictionDialog={handleOpenPaymentPackRestrictionDialog}
        onShowCompatibilityDialog={handleOpenPaymentPackCompatibilityDialog}
      />

      <MarketplacePaymentPackRestrictionModal
        paymentPack={dialogSelectedItem as PaymentPack}
        isOpen={isPaymentPackRestrictionDialogOpen && !!dialogSelectedItem}
        onDialogClose={handleClosePaymentPackRestrictionDialog}
      />

      <MarketplacePaymentPackCompatibilityModal
        categories={
          (dialogSelectedItem as MarketplacePassPagePaymentPack)?.categories ??
          []
        }
        metaActivities={paymentPackCompatibleActivities}
        establishments={paymentPackCompatibleEstablishments}
        isOpen={isPaymentPackCompatibilityDialogOpen}
        onDialogClose={handleClosePaymentPackCompatibilityDialog}
      />

      <MarketplacePrivatePassDetailsModal
        privatePass={dialogSelectedItem as PrivatePass}
        isOpen={isPrivatePassDetailsDialogOpen && !!dialogSelectedItem}
        onDialogClose={handleClosePrivatePassDetailsDialog}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onAddToCart={addPrivatePassToCart}
        onShowCompatibilityDialog={handleOpenPrivatePassCompatibilityDialog}
      />

      <MarketplacePrivatePassCompatibilityModal
        compatiblePrivateServices={privatePassCompatibleServices}
        isOpen={isPrivatePassCompatibilityDialogOpen && !!dialogSelectedItem}
        onDialogClose={handleClosePrivatePassCompatibilityDialog}
      />

      <MarketplacePaymentComboDetailsModal
        paymentCombo={dialogSelectedItem as PaymentCombo}
        isOpen={isPaymentComboDetailsDialogOpen && !!dialogSelectedItem}
        isExcludingTax={isExcludingTax}
        tax={dialogSelectedItem?.tax}
        onDialogClose={handleClosePaymentComboDetailsDialog}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};
export default MarketplacePassDialogs;
