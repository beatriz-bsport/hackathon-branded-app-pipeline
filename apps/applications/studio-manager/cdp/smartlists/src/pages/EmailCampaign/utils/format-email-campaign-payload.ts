import { CommunicationKind } from "#src/api/constants";
import type {
  ScheduleEmailCampaignPayload,
  SendEmailCampaignPayload,
  UpdateScheduledEmailCampaignPayload,
} from "#src/api/types";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";

const CONTEXT_SMARTLIST = 202;

const getEmailContent = (data: EmailCampaignFormData) => {
  const subject = (data.emailSubject ?? "").trim();

  if (data.emailTemplateId != null) {
    return { subject, email_template: data.emailTemplateId } as const;
  }

  const htmlOrTextBody = data.isTextOnly
    ? (data.emailBody ?? "")
    : (data.emailTemplateHtml ?? "");

  return { subject, body: htmlOrTextBody } as const;
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

export const formatScheduleEmailCampaignPayload = ({
  smartlistId,
  data,
  datetimeScheduled,
}: {
  smartlistId: number;
  data: EmailCampaignFormData;
  datetimeScheduled: string;
}): ScheduleEmailCampaignPayload => {
  const basePayload = {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.EMAIL,
    title: (data.emailSubject ?? "").trim(),
    datetime_scheduled: datetimeScheduled,
  } as const;

  if (data.emailTemplateId != null) {
    return {
      ...basePayload,
      email_design: data.emailTemplateId,
      text: "",
    };
  }

  return {
    ...basePayload,
    text: data.isTextOnly
      ? (data.emailBody ?? "")
      : (data.emailTemplateHtml ?? ""),
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
  const basePayload = {
    smartlist: smartlistId,
    communication_kind: CommunicationKind.EMAIL,
    title: (data.emailSubject ?? "").trim(),
    datetime_scheduled: datetimeScheduled,
  } as const;

  if (data.emailTemplateId != null) {
    return {
      ...basePayload,
      email_design: data.emailTemplateId,
      text: "",
    };
  }

  return {
    ...basePayload,
    text: data.isTextOnly
      ? (data.emailBody ?? "")
      : (data.emailTemplateHtml ?? ""),
  };
};
