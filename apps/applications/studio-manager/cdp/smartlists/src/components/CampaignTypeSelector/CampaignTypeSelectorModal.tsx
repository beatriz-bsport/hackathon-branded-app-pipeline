import { useState } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";

import { useCommunicationPackageUpsellRequest } from "#src/hooks/use-communication-package-upsell-request";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

import { TypeSelectorCard } from "../TypeSelectorCard/TypeSelectorCard";
import {
  CommunicationPackageUpsellModal,
  type UpsellCampaignTypeId,
} from "./CommunicationPackageUpsellModal";
import { UpsellInterestConfirmationModal } from "./UpsellInterestConfirmationModal";
import { CampaignTypeOption } from "./use-campaign-type-options";

type CampaignTypeSelectorModalProps = {
  campaignTypeOptions: CampaignTypeOption[];
  isOpen: boolean;
  onClose: () => void;
};

export const CampaignTypeSelectorModal = ({
  campaignTypeOptions,
  isOpen,
  onClose,
}: CampaignTypeSelectorModalProps) => {
  const { t } = useTranslation("campaign");
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedUpsellCampaignTypeId, setSelectedUpsellCampaignTypeId] =
    useState<UpsellCampaignTypeId | null>(null);

  const { requestUpsell, isPending: isRequestUpsellPending } =
    useCommunicationPackageUpsellRequest({
      onSuccess: () => {
        setIsUpsellModalOpen(false);
        setIsConfirmationOpen(true);
        openIntercomConversation();
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          description: String(
            t("communicationPackageUpsellModal.toast.requestFailed"),
          ),
        });
      },
    });

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("campaignTypeSelector.title")}
      onClose={onClose}
    >
      <div className="flex flex-col gap-sm">
        <Body htmlVariant="p" size="md" weight="weak">
          {t("campaignTypeSelector.description")}
        </Body>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          {campaignTypeOptions.map((option) => (
            <TypeSelectorCard
              key={option.id}
              icon={option.icon}
              title={option.titleKey}
              description={option.descriptionKey}
              chipLabel={
                option.showAddOnChip
                  ? t("campaignTypeSelector.addOnChip")
                  : undefined
              }
              onClick={() => {
                if (option.showAddOnChip && option.id !== "email") {
                  setSelectedUpsellCampaignTypeId(option.id);
                  setIsUpsellModalOpen(true);
                } else {
                  option.onClick?.();
                }
              }}
            />
          ))}
        </div>
      </div>
      <CommunicationPackageUpsellModal
        isOpen={isUpsellModalOpen}
        selectedCampaignTypeId={selectedUpsellCampaignTypeId}
        onClose={() => setIsUpsellModalOpen(false)}
        onGetInTouch={requestUpsell}
        isGetInTouchPending={isRequestUpsellPending}
      />
      <UpsellInterestConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleConfirmationClose}
      />
    </Modal>
  );
};
