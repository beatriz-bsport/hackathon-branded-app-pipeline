// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/components/WellhubProductModal/WellhubProductModal.tsx
import React, { useState } from "react";

import type {
  OfferMissingWellhubProduct,
  UpdateWellhubProductIdPayload,
} from "@bsport/api-book";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useUpdateWellhubProductId } from "../../hooks/use-update-wellhub-product-id";
import { WellhubProductForm } from "./wellhub-product-form";
import { WellhubSessionList } from "./wellhub-session-list";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  offers: OfferMissingWellhubProduct[];
  isLoading: boolean;
  onChangePage: (page: number) => void;
};

export const WellhubProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPage,
  totalPages,
  totalItems,
  offers,
  isLoading,
  onChangePage,
}) => {
  const { t } = useTranslation("common");

  const [selectedOffer, setSelectedOffer] =
    useState<OfferMissingWellhubProduct | null>(null);
  const [payload, setPayload] = useState<UpdateWellhubProductIdPayload | null>(
    null,
  );

  const { mutate: updateWellhubProductId, isPending } =
    useUpdateWellhubProductId();

  const handleClose = () => {
    setSelectedOffer(null);
    setPayload(null);
    onClose();
  };

  const handleOfferClick = (offer: OfferMissingWellhubProduct) => {
    setSelectedOffer(offer);
    setPayload(null);
  };

  const handleConfirm = () => {
    if (!selectedOffer || !payload) return;
    updateWellhubProductId(
      { offerId: selectedOffer.id, payload },
      { onSuccess: handleClose },
    );
  };

  const steps = [
    {
      label: t("wellhub.productModal.stepSelectSession"),
      content: (
        <WellhubSessionList
          offers={offers}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          selectedOfferId={selectedOffer?.id ?? null}
          onOfferClick={handleOfferClick}
          onChangePage={onChangePage}
        />
      ),
      validate: () => selectedOffer !== null,
    },
    {
      label: t("wellhub.productModal.stepSetProduct"),
      content: selectedOffer ? (
        <WellhubProductForm
          offer={selectedOffer}
          onPayloadChange={(p) => setPayload(p)}
        />
      ) : null,
      validate: () => payload !== null,
    },
  ];

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={t("wellhub.productModal.title")}
      steps={steps}
      onClose={handleClose}
      onClickOutside={handleClose}
      confirmButton={{
        label: t("wellhub.productModal.confirmButton"),
        onClick: handleConfirm,
        disabled: isPending,
        loading: isPending,
      }}
      cancelButton={{
        label: t("wellhub.productModal.cancelButton"),
        onClick: () => {
          setSelectedOffer(null);
          setPayload(null);
        },
      }}
    />
  );
};
