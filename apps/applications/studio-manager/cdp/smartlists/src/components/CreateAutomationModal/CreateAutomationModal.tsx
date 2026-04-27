import { useState } from "react";
import { useParams } from "react-router";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SMARTLIST_LEGACY_URLS } from "#src/urls";
import { Trans, useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { TypeSelectorCard } from "../TypeSelectorCard/TypeSelectorCard";

type CreateAutomationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CreateAutomationStep = "automation-type" | "message-channel";

export const CreateAutomationModal = ({
  isOpen,
  onClose,
}: CreateAutomationModalProps) => {
  const { t } = useTranslation("details");

  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");

  const {
    navigateToSmartlistEmailAutomationCreation,
    navigateToSmartlistPushAutomationCreation,
    navigateToSmartlistSmsAutomationCreation,
    navigateToSmartlistTagRuleAutomationCreation,
  } = useSmartlistNavigation();

  const [step, setStep] = useState<CreateAutomationStep>("automation-type");

  const handleClose = () => {
    setStep("automation-type");
    onClose();
  };

  const handlePushNotificationClick = () => {
    handleClose();
    navigateToSmartlistPushAutomationCreation(id);
  };

  const handleEmailClick = () => {
    handleClose();
    navigateToSmartlistEmailAutomationCreation(id);
  };

  const handleSmsClick = () => {
    handleClose();
    navigateToSmartlistSmsAutomationCreation(id);
  };

  const handleTagRuleClick = () => {
    navigateToSmartlistTagRuleAutomationCreation(id);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("actions.createAutomationModal.title")}
      description={
        <Body htmlVariant="p" size="md" weight="weak">
          <Trans
            defaults={t("actions.createAutomationModal.description")}
            components={{
              audienceLink: (
                <a
                  href={SMARTLIST_LEGACY_URLS.audience}
                  className="text-main-main underline"
                  aria-label={t(
                    "actions.createAutomationModal.audienceLinkLabel",
                  )}
                  target="_self"
                >
                  {t("actions.createAutomationModal.audienceLinkLabel")}
                </a>
              ),
            }}
          />
        </Body>
      }
      onClose={handleClose}
    >
      <div className="flex flex-col gap-sm">
        {step === "automation-type" ? (
          <>
            <Body htmlVariant="p" size="md" weight="weak">
              {t("actions.createAutomationModal.automationType.selectLabel")}
            </Body>
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              <TypeSelectorCard
                title={t(
                  "actions.createAutomationModal.automationType.automatedMessage.title",
                )}
                description={t(
                  "actions.createAutomationModal.automationType.automatedMessage.description",
                )}
                icon="mail-01"
                layout="oneRow"
                onClick={() => setStep("message-channel")}
              />
              <TypeSelectorCard
                title={t(
                  "actions.createAutomationModal.automationType.tagRule.title",
                )}
                description={t(
                  "actions.createAutomationModal.automationType.tagRule.description",
                )}
                icon="announcement-01"
                layout="oneRow"
                onClick={handleTagRuleClick}
              />
            </div>
          </>
        ) : (
          <>
            <Body htmlVariant="p" size="md" weight="weak">
              {t("actions.createAutomationModal.messageChannel.selectLabel")}
            </Body>
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              <TypeSelectorCard
                title={t(
                  "actions.createAutomationModal.messageChannel.email.title",
                )}
                description={t(
                  "actions.createAutomationModal.messageChannel.email.description",
                )}
                icon="mail-01"
                onClick={handleEmailClick}
              />
              <TypeSelectorCard
                title={t(
                  "actions.createAutomationModal.messageChannel.sms.title",
                )}
                description={t(
                  "actions.createAutomationModal.messageChannel.sms.description",
                )}
                icon="message-dots-circle"
                onClick={handleSmsClick}
              />
              <TypeSelectorCard
                title={t(
                  "actions.createAutomationModal.messageChannel.push.title",
                )}
                description={t(
                  "actions.createAutomationModal.messageChannel.push.description",
                )}
                icon="notification-message"
                onClick={handlePushNotificationClick}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
