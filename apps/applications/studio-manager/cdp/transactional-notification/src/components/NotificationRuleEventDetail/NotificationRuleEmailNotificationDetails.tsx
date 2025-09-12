import { useEffect, useMemo, useState } from "react";

import { Alert, Body, Checkbox, Divider } from "@bsport/kaizen-primitive-core";

import { EmailTemplateSelector } from "#src/components/EmailTemplateSelector/EmailTemplateSelector";
import { HTMLPreview } from "#src/components/PreviewComponents/HTMLPreview";
import { useFetchEmailTemplateDetails } from "#src/hooks/api/use-fetch-email-template-details";
import { useFetchResolvedGenericCommunicationVariables } from "#src/hooks/api/use-fetch-resolved-generic-communication-variables";
import { useUpdateNotificationRule } from "#src/hooks/api/use-update-notification-rule";
import { useTranslation } from "#src/utils/i18n";
import { getIsEmailCarbonCopyDisabled } from "#src/utils/notificationRuleDetails";
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

const EMAIL_TEMPLATE_MISSING_REQUIRED_COMMUNICATION_VARIABLES_ERROR_CODE =
  "19000";

export const NotificationRuleEmailNotificationDetails = ({
  emailDesignId,
  selectedNotificationEventId,
  selectedNotificationRule,
  fetchNotificationRuleEventData,
  toggleEmailCarbonCopy,
}: NotificationRuleEventTableContentProps) => {
  const { t } = useTranslation("transactionalNotification");
  const [
    displayRequiredCommunicationVariablesAlert,
    setDisplayRequiredCommunicationVariablesAlert,
  ] = useState(false);
  const [isCarbonCopyEnabled, setIsCarbonCopyEnabled] = useState<
    "checked" | "unchecked"
  >("unchecked");
  const isEmailNotificationManagedByFranchisor =
    !!selectedNotificationRule?.details?.franchisor;
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
      onFailure: (error) => {
        if (
          error instanceof Error &&
          error.name ===
            EMAIL_TEMPLATE_MISSING_REQUIRED_COMMUNICATION_VARIABLES_ERROR_CODE
        ) {
          setDisplayRequiredCommunicationVariablesAlert(true);
        }
      },
    });

  useEffect(() => {
    setIsCarbonCopyEnabled(
      selectedNotificationRule?.settings?.send_company
        ? "checked"
        : "unchecked",
    );
    setDisplayRequiredCommunicationVariablesAlert(false);
  }, [selectedNotificationRule?.settings]);

  const emailTemplateSelectorHelperText = useMemo(() => {
    if (isEmailNotificationManagedByFranchisor)
      return t("notificationRuleEventDetails.table.tooltip.franchiseOwned");
    if (displayRequiredCommunicationVariablesAlert)
      return t(
        "notificationRuleEventDetails.details.emailNotification.select.alertCommunicationVariableStatus",
      );
    return undefined;
  }, [
    displayRequiredCommunicationVariablesAlert,
    isEmailNotificationManagedByFranchisor,
  ]);

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <EmailTemplateSelector
          disabled={isEmailNotificationManagedByFranchisor}
          defaultTemplateId={emailDesignId ?? undefined}
          onSelectTemplate={(selectedTemplate) => {
            if (!selectedTemplate) {
              if (selectedNotificationRule!.details) {
                updateEmailDesignInNotification({
                  emailDesignId: null,
                  notificationEventDetails: selectedNotificationRule!.details,
                });
              }
              setDisplayRequiredCommunicationVariablesAlert(false);
              return;
            }
            if (selectedTemplate.id !== emailDesignId) {
              setDisplayRequiredCommunicationVariablesAlert(false);
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
          textfieldProps={{
            placeholder: selectedNotificationRule?.details?.email_template
              ? t(
                  "notificationRuleEventDetails.details.emailNotification.select.standardBsportTemplatePlaceholder",
                )
              : t(
                  "notificationRuleEventDetails.details.emailNotification.select.placeholder",
                ),
            status: displayRequiredCommunicationVariablesAlert
              ? "error"
              : "default",
            statusText: emailTemplateSelectorHelperText,
            iconLeft: isEmailNotificationManagedByFranchisor
              ? "lock-01"
              : "mail-01",
          }}
        />
        {displayRequiredCommunicationVariablesAlert && (
          <Alert status="warning" type="weak">
            {t(
              "notificationRuleEventDetails.details.emailNotification.requiredCommunicationVariablesAlert.body",
            )}
            {(selectedNotificationRule?.rule?.required_tags ?? []).length >
              0 && (
              <ul>
                {selectedNotificationRule.rule.required_tags.map((tag) => (
                  <li key={tag} className="list-disc list-inside">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </Alert>
        )}
        <Checkbox
          id="carbon-copy-checkbox"
          value={isCarbonCopyEnabled}
          label={t(
            "notificationRuleEventDetails.details.emailNotification.carbonCopy.label",
          )}
          disabled={
            selectedNotificationRule
              ? getIsEmailCarbonCopyDisabled({
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
        noContentMessage={t(
          "notificationRuleEventDetails.details.emailNotification.noPreview",
        )}
      />
    </div>
  );
};
