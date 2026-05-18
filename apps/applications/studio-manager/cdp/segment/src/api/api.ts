import { groupActivityKeys } from "@bsport/api-book";
import { automatedCampaignKeys } from "@bsport/api-cdp/automated-campaign";
import { communicateKeys } from "@bsport/api-cdp/communicate";
import { emailTemplateKeys } from "@bsport/api-cdp/email-template";
import { smartlistKeys } from "@bsport/api-cdp/smartlist";
import { tagsKeys } from "@bsport/api-cdp/tags";
import { establishmentKeys } from "@bsport/api-core";
import { mobileAppKeys } from "@bsport/api-member-experience";

export const smartlistQueryKeys = {
  ...smartlistKeys,
  automatedCampaignKeys: automatedCampaignKeys,
  smartlistKeys: {
    ...smartlistKeys,
  },
  communicateKeys: communicateKeys,
  emailTemplateKeys: emailTemplateKeys,
  tagsKeys: tagsKeys,
  mobileAppKeys: mobileAppKeys,
  groupActivitiesKeys: groupActivityKeys,
  establishmentsKeys: establishmentKeys,
} as const;
