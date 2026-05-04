import { communicateKeys } from "@bsport/api-cdp/communicate";
import { emailTemplateKeys } from "@bsport/api-cdp/email-template";
import { smartlistKeys } from "@bsport/api-cdp/smartlist";
import { tagsKeys } from "@bsport/api-cdp/tags";
import { mobileAppKeys } from "@bsport/api-member-experience";

export const smartlistQueryKeys = {
  ...smartlistKeys,
  communicateKeys: communicateKeys,
  emailTemplateKeys: emailTemplateKeys,
  tagsKeys: tagsKeys,
  mobileAppKeys: mobileAppKeys,
} as const;
