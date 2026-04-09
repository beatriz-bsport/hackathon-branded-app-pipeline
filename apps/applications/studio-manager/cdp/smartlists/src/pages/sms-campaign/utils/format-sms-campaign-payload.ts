import { CommunicationKind } from "#src/api/constants";
import type {
  ScheduleCampaignPayload,
  SendSmsCampaignPayload,
} from "#src/api/types";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import { CONTEXT_SMARTLIST } from "#src/utils/constants";

export const formatSendSmsCampaignPayload = ({
  smartlistId,
  data,
}: {
  smartlistId: number;
  data: SmsCampaignFormData;
}): SendSmsCampaignPayload => {
  return {
    sms: data.message,
    context_identifier: CONTEXT_SMARTLIST,
    context_object_id: smartlistId,
    member_filters: {
      smartlist: smartlistId,
    },
  };
};

export const formatScheduleSmsCampaignPayload = ({
  smartlistId,
  data,
  datetimeScheduled,
}: {
  smartlistId: number;
  data: SmsCampaignFormData;
  datetimeScheduled: string;
}): ScheduleCampaignPayload => {
  return {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.SMS,
    title: "",
    text: data.message,
    datetime_scheduled: datetimeScheduled,
  };
};
