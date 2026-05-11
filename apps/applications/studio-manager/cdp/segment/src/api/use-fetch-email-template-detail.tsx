import { useQuery } from "@tanstack/react-query";

import { emailTemplateDetailQueryOptions } from "@bsport/api-cdp/email-template";

import { fetch } from "#src/utils/fetch";

export const useFetchEmailTemplateDetail = ({
  emailTemplateId,
}: {
  emailTemplateId: number;
}) => {
  return useQuery(emailTemplateDetailQueryOptions(fetch, emailTemplateId));
};
