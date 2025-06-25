import {
  selectEmailTemplateDetail,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";

import { useFetcherEmailTemplateDetail } from "#src/hooks/api/use-fetcher-template-detail";

export const useFetchTemplateDetail = ({
  emailTemplateId,
}: {
  emailTemplateId: number | null;
}) => {
  const { isLoading, error, fetchEmailTemplateDetail } =
    useFetcherEmailTemplateDetail();

  const emailTemplateDetail = useEmailTemplateStore((state) => {
    if (!emailTemplateId) return null;
    return selectEmailTemplateDetail(state, emailTemplateId);
  });

  const isTemplateFetched = !isLoading && (error || emailTemplateDetail);

  return {
    isLoading,
    isTemplateFetched,
    emailTemplateDetail,
    fetchEmailTemplateDetail,
  };
};
