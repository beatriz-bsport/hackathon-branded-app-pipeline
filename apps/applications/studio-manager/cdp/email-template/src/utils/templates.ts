import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";

import type { PossibleEmailTemplateType } from "./types";

export function getEmailTemplateType({
  emailTemplate,
}: {
  emailTemplate: EmailTemplateSummary;
}): PossibleEmailTemplateType {
  if (emailTemplate.is_default_bsport_template) {
    return "bsport";
  }
  if (
    emailTemplate?.available_for_companies?.length > 0 &&
    !emailTemplate.company_id
  ) {
    return "master";
  }
  return "custom";
}
