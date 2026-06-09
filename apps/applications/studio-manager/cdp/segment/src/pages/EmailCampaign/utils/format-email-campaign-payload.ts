import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import type {
  ScheduleEmailCampaignPayload,
  SendEmailCampaignPayload,
  UpdateScheduledEmailCampaignPayload,
} from "@bsport/api-cdp/communicate";

import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";
import {
  CONTEXT_PREBUILT_SEGMENT,
  CONTEXT_SMARTLIST,
} from "#src/utils/constants";
import type { PrebuiltSegmentId } from "#src/utils/prebuilt-segment";

type EmailPayloadContent =
  | {
      subject: string;
      emailTemplateId: number | null;
      body: string;
    }
  | {
      subject: string;
      emailTemplateId: null;
      body: string;
    };

const resolveEmailPayloadContent = (
  data: EmailCampaignFormData,
): EmailPayloadContent => {
  const subject = (data.emailSubject ?? "").trim();

  if (data.isTextOnly) {
    return {
      subject,
      emailTemplateId: null,
      body: data.emailBody ?? "",
    };
  }

  if (data.emailTemplateId != null) {
    return {
      subject,
      emailTemplateId: data.emailTemplateId,
      body: "",
    };
  }

  return {
    subject,
    emailTemplateId: null,
    body: data.emailTemplateHtml ?? "",
  };
};

const getEmailContent = (data: EmailCampaignFormData) => {
  const { subject, emailTemplateId, body } = resolveEmailPayloadContent(data);

  if (emailTemplateId != null) {
    return { subject, email_template: emailTemplateId } as const;
  }

  return { subject, body } as const;
};

export const formatSendEmailCampaignPayload = ({
  smartlistId,
  data,
}: {
  smartlistId: number;
  data: EmailCampaignFormData;
}): SendEmailCampaignPayload => {
  const content = getEmailContent(data);

  return {
    ...content,
    context_identifier: CONTEXT_SMARTLIST,
    context_object_id: smartlistId,
    member_filters: {
      smartlist: smartlistId,
    },
  };
};

export const formatSendPrebuiltSegmentEmailCampaignPayload = ({
  segmentIdentifier,
  data,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: EmailCampaignFormData;
}): SendEmailCampaignPayload => {
  const content = getEmailContent(data);

  return {
    ...content,
    context_identifier: CONTEXT_PREBUILT_SEGMENT,
    context_segment_identifier: segmentIdentifier,
    member_filters: {
      segment_identifier: segmentIdentifier,
    },
  };
};

export const formatScheduleEmailCampaignPayload = ({
  smartlistId,
  data,
  datetimeScheduled,
}: {
  smartlistId: number;
  data: EmailCampaignFormData;
  datetimeScheduled: string;
}): ScheduleEmailCampaignPayload => {
  const { subject, emailTemplateId, body } = resolveEmailPayloadContent(data);
  const basePayload = {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.EMAIL,
    title: subject,
    datetime_scheduled: datetimeScheduled,
  } as const;

  if (emailTemplateId != null) {
    return {
      ...basePayload,
      email_design: emailTemplateId,
      text: "",
    };
  }

  return {
    ...basePayload,
    text: body,
  };
};

export const formatSchedulePrebuiltSegmentEmailCampaignPayload = ({
  segmentIdentifier,
  data,
  datetimeScheduled,
}: {
  segmentIdentifier: PrebuiltSegmentId;
  data: EmailCampaignFormData;
  datetimeScheduled: string;
}): ScheduleEmailCampaignPayload => {
  const { subject, emailTemplateId, body } = resolveEmailPayloadContent(data);
  const basePayload = {
    segment_identifier: segmentIdentifier,
    communication_kind: CommunicationKind.EMAIL,
    title: subject,
    datetime_scheduled: datetimeScheduled,
  } as const;

  if (emailTemplateId != null) {
    return {
      ...basePayload,
      email_design: emailTemplateId,
      text: "",
    };
  }

  return {
    ...basePayload,
    text: body,
  };
};

export const formatUpdateScheduledEmailCampaignPayload = ({
  smartlistId,
  data,
  datetimeScheduled,
}: {
  smartlistId: number;
  data: EmailCampaignFormData;
  datetimeScheduled: string;
}): UpdateScheduledEmailCampaignPayload => {
  const { subject, emailTemplateId, body } = resolveEmailPayloadContent(data);
  const basePayload = {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.EMAIL,
    title: subject,
    datetime_scheduled: datetimeScheduled,
  } as const;

  if (emailTemplateId != null) {
    return {
      ...basePayload,
      email_design: emailTemplateId,
      text: "",
    };
  }

  return {
    ...basePayload,
    text: body,
  };
};
