import type { DeliveryMode } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";

import type { EmailType } from "./constants";

export type EmailChannelFormData = {
  emailType: EmailType;
};

type SharedEmailTemplateFields = {
  /** Set when user selects a saved template; empty for on-the-fly (unsaved) templates. */
  emailTemplateId?: number | null;
  /** Unlayer design JSON; used for preview and future Edit email modal. */
  emailTemplateDesign?: string | null;
  /** Used only with editing an existing campaign with a body that was set as an Email Template On-the-fly.
   * This is used to determine if the email template can be editable or not.
   */
  isOnTheFlyHtmlTemplate?: boolean;
};

type TextOnlyEmailMessageContentFormData = SharedEmailTemplateFields & {
  isTextOnly: true;
  emailSubject: string;
  emailBody: string;
  /** Rendered HTML is absent for text-only content. */
  emailTemplateHtml?: string;
};

type TemplateEmailMessageContentFormData = SharedEmailTemplateFields & {
  isTextOnly: false;
  emailSubject: string;
  emailBody?: string;
  /** Rendered HTML; used for HTMLPreview and future Edit email modal. */
  emailTemplateHtml: string;
};

export type EmailMessageContentFormData =
  | TextOnlyEmailMessageContentFormData
  | TemplateEmailMessageContentFormData;

export type EmailCampaignFormData = EmailChannelFormData &
  EmailMessageContentFormData & {
    campaignName?: string;
    deliveryMode: DeliveryMode;
    scheduledDate?: string;
    scheduledTime?: string;
  };
