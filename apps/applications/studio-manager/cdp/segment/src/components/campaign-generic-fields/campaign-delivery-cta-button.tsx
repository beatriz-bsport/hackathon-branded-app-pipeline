import { Button } from "@bsport/kaizen-primitive-core";

import {
  DELIVERY_MODE_SCHEDULE_LATER,
  type DeliveryMode,
} from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import { useTranslation } from "#src/utils/i18n";

type CampaignDeliveryCtaButtonProps = {
  deliveryMode: DeliveryMode;
  formId: string;
  isDisabled: boolean;
};

/**
 * Returns a campaign CTA button based on the selected delivery mode.
 */
export function CampaignDeliveryCtaButton({
  deliveryMode,
  formId,
  isDisabled,
}: CampaignDeliveryCtaButtonProps) {
  const { t } = useTranslation("campaign");

  const label =
    deliveryMode === DELIVERY_MODE_SCHEDULE_LATER
      ? t("generic.creation.delivery.scheduleForLater")
      : t("generic.creation.delivery.sendNow");

  return (
    <Button
      color="main"
      intent="call-to-action"
      label={label}
      size="md"
      type="submit"
      form={formId}
      disabled={isDisabled}
    />
  );
}
