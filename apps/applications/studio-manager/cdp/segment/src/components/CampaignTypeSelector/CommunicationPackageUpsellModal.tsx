import { Body, Media, Modal, Title } from "@bsport/kaizen-primitive-core";

import popUpUpsellIdentifierSvg from "#src/assets/pop-up-upsell-advertiser.svg";
import pushNotificationUpsellIdentifierSvg from "#src/assets/push-notification-upsell-advertiser.svg";
import { useTranslation } from "#src/utils/i18n";

export const UPSELL_CAMPAIGN_TYPE_SMS_ID = "sms";
export const UPSELL_CAMPAIGN_TYPE_PUSH_ID = "push";
export const UPSELL_CAMPAIGN_TYPE_POPUP_ID = "popup";

export type UpsellCampaignTypeId =
  | typeof UPSELL_CAMPAIGN_TYPE_SMS_ID
  | typeof UPSELL_CAMPAIGN_TYPE_PUSH_ID
  | typeof UPSELL_CAMPAIGN_TYPE_POPUP_ID;

const UPSELL_CAMPAIGN_TYPE_ID_TO_SVG_MAP = {
  [UPSELL_CAMPAIGN_TYPE_SMS_ID]: pushNotificationUpsellIdentifierSvg,
  [UPSELL_CAMPAIGN_TYPE_PUSH_ID]: pushNotificationUpsellIdentifierSvg,
  [UPSELL_CAMPAIGN_TYPE_POPUP_ID]: popUpUpsellIdentifierSvg,
};

type CommunicationPackageUpsellModalProps = {
  isOpen: boolean;
  selectedCampaignTypeId: UpsellCampaignTypeId | null;
  onClose: () => void;
  onGetInTouch: (typeId: UpsellCampaignTypeId) => void;
  isGetInTouchPending?: boolean;
};

export const CommunicationPackageUpsellModal = ({
  isOpen,
  selectedCampaignTypeId,
  onClose,
  onGetInTouch,
  isGetInTouchPending = false,
}: CommunicationPackageUpsellModalProps) => {
  const { t } = useTranslation("campaign");

  const typeId = selectedCampaignTypeId ?? UPSELL_CAMPAIGN_TYPE_PUSH_ID;

  const handleGetInTouch = () => {
    if (!selectedCampaignTypeId) return;
    onGetInTouch(selectedCampaignTypeId);
  };

  const baseKey = `communicationPackageUpsellModal.${typeId}` as const;

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("communicationPackageUpsellModal.title")}
      onClose={onClose}
      cancelButton={{
        label: t("communicationPackageUpsellModal.buttons.cancel"),
        onClick: onClose,
      }}
      confirmButton={{
        label: t("communicationPackageUpsellModal.buttons.getInTouch"),
        onClick: handleGetInTouch,
        disabled: isGetInTouchPending || !selectedCampaignTypeId,
      }}
    >
      <div className="flex flex-col gap-md">
        <div
          className="relative h-[240px] w-full overflow-hidden rounded-md border border-stroke-default border-stroke-thin bg-surface-default-elevated"
          aria-hidden
        >
          <Media
            src={UPSELL_CAMPAIGN_TYPE_ID_TO_SVG_MAP[typeId]}
            className="h-full w-full max-h-none object-cover"
            alt={t(`${baseKey}.heading`)}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <Title htmlVariant="h3" weight="strong">
            {t(`${baseKey}.heading`)}
          </Title>
          <Body htmlVariant="p" size="md" weight="weak">
            {t(`${baseKey}.description`)}
          </Body>
          <Body htmlVariant="p" size="sm" weight="weak" color="weak">
            {t("communicationPackageUpsellModal.disclaimer")}
          </Body>
        </div>
      </div>
    </Modal>
  );
};
