import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import {
  type ScheduleCampaignPayload,
  type SendPushCampaignPayload,
} from "@bsport/api-cdp/communicate";

import type { PushCampaignFormData } from "#src/components/push-campaign-form/types";
import {
  CONTEXT_PREBUILT_SEGMENT,
  CONTEXT_SMARTLIST,
} from "#src/utils/constants";
import type { PrebuiltSegmentId } from "#src/utils/prebuilt-segment";

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

export const formatSendPrebuiltSegmentPushCampaignPayload = ({
  segmentIdentifier,
  data,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: PushCampaignFormData;
}): SendPushCampaignPayload => {
  return {
    notification_title: data.title.trim(),
    notification_content: data.message,
    context_identifier: CONTEXT_PREBUILT_SEGMENT,
    context_segment_identifier: segmentIdentifier,
    member_filters: {
      segment_identifier: segmentIdentifier,
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

export const formatSchedulePrebuiltSegmentPushCampaignPayload = ({
  segmentIdentifier,
  data,
  datetimeScheduled,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: PushCampaignFormData;
  datetimeScheduled: string;
}): ScheduleCampaignPayload => {
  return {
    segment_identifier: segmentIdentifier,
    communication_kind: CommunicationKind.PUSH,
    title: data.title.trim(),
    text: data.message,
    datetime_scheduled: datetimeScheduled,
  };
};
