import { useQuery } from "@tanstack/react-query";

import { emailTemplateDetailQueryOptions } from "./api";

export const useFetchEmailTemplateDetail = ({
  emailTemplateId,
}: {
  emailTemplateId: number;
}) => {
  return useQuery(emailTemplateDetailQueryOptions(emailTemplateId));
};
