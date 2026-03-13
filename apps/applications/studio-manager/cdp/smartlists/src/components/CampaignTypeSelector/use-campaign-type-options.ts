import { IconName } from "@bsport/kaizen-primitive-core";

import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useUpsellChecker } from "#src/hooks/use-upsell-checker";
import { useTranslation } from "#src/utils/i18n";

export type CampaignTypeId = "email" | "sms" | "push" | "popup";

export type CampaignTypeOption = {
  id: CampaignTypeId;
  icon: IconName;
  titleKey: string;
  descriptionKey: string;
  showAddOnChip: boolean;
  onClick?: () => void;
};

export const useCampaignTypeOptions = ({
  smartlistId,
}: {
  smartlistId: string;
}) => {
  const { t } = useTranslation("campaign");
  const { showAddOnChipSms, showAddOnChipPush, showAddOnChipPopup } =
    useUpsellChecker();

  const { navigateToSmartlistCampaignCreate } = useSmartlistNavigation();

  const options: CampaignTypeOption[] = [
    {
      id: "email",
      icon: "mail-01",
      titleKey: t("campaignTypeSelector.email.title"),
      descriptionKey: t("campaignTypeSelector.email.description"),
      showAddOnChip: false,
      onClick: () => {
        navigateToSmartlistCampaignCreate(smartlistId, "email");
      },
    },
    {
      id: "sms",
      icon: "message-dots-circle",
      titleKey: t("campaignTypeSelector.sms.title"),
      descriptionKey: t("campaignTypeSelector.sms.description"),
      showAddOnChip: showAddOnChipSms,
    },
    {
      id: "push",
      icon: "notification-message",
      titleKey: t("campaignTypeSelector.push.title"),
      descriptionKey: t("campaignTypeSelector.push.description"),
      showAddOnChip: showAddOnChipPush,
    },
    {
      id: "popup",
      icon: "announcement-01",
      titleKey: t("campaignTypeSelector.popup.title"),
      descriptionKey: t("campaignTypeSelector.popup.description"),
      showAddOnChip: showAddOnChipPopup,
      onClick: () => {
        navigateToSmartlistCampaignCreate(smartlistId, "popup");
      },
    },
  ];

  return options;
};
