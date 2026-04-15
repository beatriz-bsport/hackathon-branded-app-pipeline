import React, { useState } from "react";

import {
  OfferMissingWellhubProduct,
  UpdateWellhubProductIdPayload,
} from "@bsport/api-book";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useUpdateWellhubProductId } from "#src/hooks/wellhub/use-update-wellhub-product-id";
import { useTranslation } from "#src/utils/i18n";

import { WellhubProductForm } from "./WellhubProductForm";
import { WellhubSessionList } from "./WellhubSessionList";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  totalPages: number;
  offers: OfferMissingWellhubProduct[];
  isLoading: boolean;
  onChangePage: (page: number) => void;
};

export const WellhubProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPage,
  totalPages,
  offers,
  isLoading,
  onChangePage,
}) => {
  const { t } = useTranslation("sessionList");

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
      label: t("wellhub.modal.stepSelectSession"),
      content: (
        <WellhubSessionList
          offers={offers}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedOfferId={selectedOffer?.id ?? null}
          onOfferClick={handleOfferClick}
          onChangePage={onChangePage}
        />
      ),
      validate: () => selectedOffer !== null,
    },
    {
      label: t("wellhub.modal.stepSetProduct"),
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
      title={t("wellhub.modal.title")}
      steps={steps}
      onClose={handleClose}
      onClickOutside={handleClose}
      confirmButton={{
        label: t("wellhub.modal.confirmButton"),
        onClick: handleConfirm,
        disabled: isPending,
        loading: isPending,
      }}
      cancelButton={{
        label: t("wellhub.modal.cancelButton"),
        onClick: () => {
          setSelectedOffer(null);
          setPayload(null);
        },
      }}
    />
  );
};
