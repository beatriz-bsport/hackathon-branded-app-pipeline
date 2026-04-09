import type { DeliveryMode } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";

import type { EmailType } from "./constants";

export type EmailCampaignFormData = {
  emailType: EmailType;
  campaignName: string;
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
  isTextOnly: boolean;
  emailSubject?: string;
  emailBody?: string;
  /** Set when user selects a saved template; empty for on-the-fly (unsaved) templates. */
  emailTemplateId?: number | null;
  /** Unlayer design JSON; used for preview and future Edit email modal. */
  emailTemplateDesign?: string | null;
  /** Rendered HTML; used for HTMLPreview and future Edit email modal. */
  emailTemplateHtml?: string | null;
  /** Used only with editing an existing campaign with a body that was set as an Email Template On-the-fly.
   * This is used to determine if the email template can be editable or not.
   */
  isOnTheFlyHtmlTemplate?: boolean;
};
