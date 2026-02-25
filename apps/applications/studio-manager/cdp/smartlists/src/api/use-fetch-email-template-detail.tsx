import { useSuspenseQuery } from "@tanstack/react-query";

import { emailTemplateDetailQueryOptions } from "./api";

export const useFetchEmailTemplateDetail = ({
  emailTemplateId,
}: {
  emailTemplateId: number;
}) => {
  return useSuspenseQuery(emailTemplateDetailQueryOptions(emailTemplateId));
};
