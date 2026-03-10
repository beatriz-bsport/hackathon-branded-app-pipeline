import { useState } from "react";

import {
  Body,
  Card,
  Chip,
  Icon,
  Modal,
  Title,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useCommunicationPackageUpsellRequest } from "#src/hooks/use-communication-package-upsell-request";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

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
            <Card
              key={option.id}
              actionable
              padding="default"
              elevated
              onClick={() => {
                if (option.showAddOnChip && option.id !== "email") {
                  setSelectedUpsellCampaignTypeId(option.id);
                  setIsUpsellModalOpen(true);
                } else {
                  option.onClick?.();
                }
              }}
            >
              <div className="flex flex-col gap-xs">
                <div className="flex flex-row flex-wrap items-center gap-xs">
                  <Icon
                    style={{ color: "#565E5D" }}
                    icon={option.icon}
                    size="md"
                  />
                  <Title htmlVariant="h4" weight="strong" color="weak">
                    {option.titleKey}
                  </Title>
                  {option.showAddOnChip && (
                    <Chip
                      type="weak"
                      color="main"
                      size="sm"
                      label={t("campaignTypeSelector.addOnChip")}
                    />
                  )}
                </div>
                <Body htmlVariant="p" size="md" weight="weak" color="weak">
                  {option.descriptionKey}
                </Body>
              </div>
            </Card>
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
