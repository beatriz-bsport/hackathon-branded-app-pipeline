import { Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { HTMLPreview } from "#src/components/MarketingNotificationDetails/Content/HTMLPreview";
import { PushNotificationContent } from "#src/components/MarketingNotificationDetails/Content/PushNotificationContent";
import { useFetchEmailTemplateDetails } from "#src/hooks/api/use-fetch-email-template-details";
import { useUpsellChecker } from "#src/hooks/permissions/use-upsell-checker";
import { useTranslation } from "#src/utils/i18n";

export const MarketingNotificationContentDetails = ({
  notification,
}: {
  notification: MarketingNotification;
}) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const { emailTemplateDetail } = useFetchEmailTemplateDetails({
    emailTemplateId: notification.email_design,
  });
  const { isPushNotificationUpsellActivated } = useUpsellChecker();

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h3" weight="strong">
          {t("drawer.content.email.title")}
        </Title>
        <HTMLPreview
          htmlContent={emailTemplateDetail?.html || ""}
          noContentMessage={t("drawer.content.email.noPreview")}
        />
      </div>
      {isPushNotificationUpsellActivated ? (
        <PushNotificationContent notification={notification} />
      ) : null}
    </div>
  );
};
