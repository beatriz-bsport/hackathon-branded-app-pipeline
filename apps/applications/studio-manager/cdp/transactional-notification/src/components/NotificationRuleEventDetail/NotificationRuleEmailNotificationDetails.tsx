import { useEffect, useState } from "react";

import { Body, Checkbox, Divider } from "@bsport/kaizen-primitive-core";

import { EmailTemplateSelector } from "#src/components/EmailTemplateSelector/EmailTemplateSelector";
import { HTMLPreview } from "#src/components/PreviewComponents/HTMLPreview";
import { useFetchEmailTemplateDetails } from "#src/hooks/api/use-fetch-email-template-details";
import { useFetchResolvedGenericCommunicationVariables } from "#src/hooks/api/use-fetch-resolved-generic-communication-variables";
import { useUpdateNotificationRule } from "#src/hooks/api/use-update-notification-rule";
import { useTranslation } from "#src/utils/i18n";
import { getIsEmailNotificationDisabled } from "#src/utils/notificationRuleDetails";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

type NotificationRuleEventTableContentProps = {
  emailDesignId: number | null;
  selectedNotificationEventId: number;
  selectedNotificationRule: RefinedNotificationRuleEventData;
  fetchNotificationRuleEventData: () => void;
  toggleEmailCarbonCopy: (params: {
    checked: boolean;
    notificationEventId: number;
  }) => void;
};

export const NotificationRuleEmailNotificationDetails = ({
  emailDesignId,
  selectedNotificationEventId,
  selectedNotificationRule,
  fetchNotificationRuleEventData,
  toggleEmailCarbonCopy,
}: NotificationRuleEventTableContentProps) => {
  const { t } = useTranslation("transactionalNotification");
  const [isCarbonCopyEnabled, setIsCarbonCopyEnabled] = useState<
    "checked" | "unchecked"
  >("unchecked");
  const { emailTemplateDetail } = useFetchEmailTemplateDetails({
    emailTemplateId: selectedNotificationRule?.details?.email_design ?? null,
  });
  const { genericCommunicationVariables } =
    useFetchResolvedGenericCommunicationVariables();

  const { createEmailDesignInNotification, updateEmailDesignInNotification } =
    useUpdateNotificationRule({
      notificationEventId: selectedNotificationEventId,
      notificationEventDetails: selectedNotificationRule?.details,
      onSuccess: () => {
        fetchNotificationRuleEventData();
      },
    });

  useEffect(() => {
    setIsCarbonCopyEnabled(
      selectedNotificationRule?.settings?.send_company
        ? "checked"
        : "unchecked",
    );
  }, [selectedNotificationRule?.settings]);

  return (
    <div className="flex flex-col gap-md">
      <div>
        <EmailTemplateSelector
          defaultTemplateId={emailDesignId ?? undefined}
          onSelectTemplate={(selectedTemplate) => {
            if (selectedTemplate.id !== emailDesignId) {
              if (!selectedNotificationRule?.details) {
                createEmailDesignInNotification({
                  emailDesignId: selectedTemplate.id,
                });
              } else {
                updateEmailDesignInNotification({
                  emailDesignId: selectedTemplate.id,
                  notificationEventDetails: selectedNotificationRule.details,
                });
              }
            }
          }}
        />
        <Checkbox
          id="carbon-copy-checkbox"
          value={isCarbonCopyEnabled}
          label={t(
            "notificationRuleEventDetails.details.emailNotification.carbonCopy.label",
          )}
          disabled={
            selectedNotificationRule
              ? getIsEmailNotificationDisabled({
                  refinedNotificationRuleData: selectedNotificationRule,
                })
              : true
          }
          onChange={(checked) => {
            setIsCarbonCopyEnabled(checked ? "checked" : "unchecked");
            toggleEmailCarbonCopy({
              checked,
              notificationEventId:
                selectedNotificationRule.rule.notification_event,
            });
          }}
        />
      </div>
      <Divider orientation="horizontal" weight="thin" />
      <Body htmlVariant="span" weight="strong" className="self-center">
        {t("notificationRuleEventDetails.details.emailNotification.preview")}
      </Body>
      <HTMLPreview
        htmlContent={
          emailTemplateDetail?.html ||
          selectedNotificationRule?.details?.email_template ||
          ""
        }
        resolvedGenericTags={genericCommunicationVariables}
      />
    </div>
  );
};
