import {
  establishmentKeys,
  groupActivityKeys,
  teacherKeys,
} from "@bsport/api-book";
import { automatedCampaignKeys } from "@bsport/api-cdp/automated-campaign";
import { communicateKeys } from "@bsport/api-cdp/communicate";
import { emailTemplateKeys } from "@bsport/api-cdp/email-template";
import { smartlistKeys } from "@bsport/api-cdp/smartlist";
import { tagsKeys } from "@bsport/api-cdp/tags";
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
  coachOptionsForTotalBooking: (companyId: number | undefined) =>
    [
      ...teacherKeys.all,
      "segment",
      "total-booking-coach-options",
      companyId,
    ] as const,
  levelOptionsForTotalBooking: (companyId: number | undefined) =>
    ["segment", "total-booking-level-options", companyId] as const,
} as const;
