import { CommunicationKind } from "#src/api/constants";
import type {
  ScheduleCampaignPayload,
  SendPushCampaignPayload,
} from "#src/api/types";
import type { PushCampaignFormData } from "#src/components/push-campaign-form/types";
import { CONTEXT_SMARTLIST } from "#src/utils/constants";

export const formatSendPushCampaignPayload = ({
  smartlistId,
  data,
}: {
  smartlistId: number;
  data: PushCampaignFormData;
}): SendPushCampaignPayload => {
  return {
    notification_title: data.title.trim(),
    notification_content: data.message,
    context_identifier: CONTEXT_SMARTLIST,
    context_object_id: smartlistId,
    member_filters: {
      smartlist: smartlistId,
    },
  };
};

export const formatSchedulePushCampaignPayload = ({
  smartlistId,
  data,
  datetimeScheduled,
}: {
  smartlistId: number;
  data: PushCampaignFormData;
  datetimeScheduled: string;
}): ScheduleCampaignPayload => {
  return {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.PUSH,
    title: data.title.trim(),
    text: data.message,
    datetime_scheduled: datetimeScheduled,
  };
};
