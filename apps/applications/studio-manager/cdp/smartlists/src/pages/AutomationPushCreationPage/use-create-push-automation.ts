import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";

import { CommunicationKind, EventKind } from "#src/api/constants";
import { useCreateAutomatedCampaign } from "#src/api/use-create-automated-campaign";
import { useTranslation } from "#src/utils/i18n";

import {
  PUSH_AUTOMATION_EVENT_VALUES,
  PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type PushAutomationFormData,
} from "./types";

const mapTriggerLimitToMaxCommunicationsSentPerMember = (
  triggerLimit: PushAutomationFormData["triggerLimit"],
): number | null => {
  if (triggerLimit === PUSH_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT) {
    return null;
  }

  return Number(triggerLimit);
};

export const useCreatePushAutomation = ({
  smartlistId,
}: {
  smartlistId: string;
}) => {
  const { t } = useTranslation("details");
  const navigate = useNavigate();

  const { createAutomatedCampaign } = useCreateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.push.toasts.success.created"),
      });
      navigate(`/${smartlistId}/automation`);
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.push.toasts.error.createFailed"),
      });
    },
  });

  const createPushAutomation = async (data: PushAutomationFormData) => {
    await createAutomatedCampaign({
      smartlist: Number(smartlistId),
      communication_kind: CommunicationKind.PUSH,
      event_kind:
        data.eventKind === PUSH_AUTOMATION_EVENT_VALUES.ENTRY
          ? EventKind.JOIN
          : EventKind.LEAVE,
      title: data.title,
      text: data.message,
      max_communications_sent_per_member:
        mapTriggerLimitToMaxCommunicationsSentPerMember(data.triggerLimit),
    });
  };

  return {
    createPushAutomation,
  } as const;
};
