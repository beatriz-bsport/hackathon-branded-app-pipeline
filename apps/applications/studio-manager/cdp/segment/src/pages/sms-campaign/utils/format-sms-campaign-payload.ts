import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import {
  type ScheduleCampaignPayload,
  type SendSmsCampaignPayload,
} from "@bsport/api-cdp/communicate";

import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import {
  CONTEXT_PREBUILT_SEGMENT,
  CONTEXT_SMARTLIST,
} from "#src/utils/constants";
import type { PrebuiltSegmentId } from "#src/utils/prebuilt-segment";

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

export const formatSendPrebuiltSegmentSmsCampaignPayload = ({
  segmentIdentifier,
  data,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: SmsCampaignFormData;
}): SendSmsCampaignPayload => {
  return {
    sms: data.message,
    context_identifier: CONTEXT_PREBUILT_SEGMENT,
    context_segment_identifier: segmentIdentifier,
    member_filters: {
      segment_identifier: segmentIdentifier,
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

export const formatSchedulePrebuiltSegmentSmsCampaignPayload = ({
  segmentIdentifier,
  data,
  datetimeScheduled,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: SmsCampaignFormData;
  datetimeScheduled: string;
}): ScheduleCampaignPayload => {
  return {
    segment_identifier: segmentIdentifier,
    communication_kind: CommunicationKind.SMS,
    title: "",
    text: data.message,
    datetime_scheduled: datetimeScheduled,
  };
};
