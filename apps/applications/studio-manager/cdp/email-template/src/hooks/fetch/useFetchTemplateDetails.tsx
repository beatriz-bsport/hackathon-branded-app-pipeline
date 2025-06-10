import { useCallback } from "react";

import {
  fetchEmailTemplateDetailAction,
  selectEmailTemplateDetail,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchTemplateDetail = ({
  emailTemplateId,
}: {
  emailTemplateId: number;
}) => {
  const emailTemplateDetail = useEmailTemplateStore((state) =>
    selectEmailTemplateDetail(state, emailTemplateId),
  );

  const _fetchEmailTemplateDetail = useCallback(async (templateId: number) => {
    return fetchEmailTemplateDetailAction(fetch, {
      id: templateId,
    });
  }, []);

  const [{ isLoading }, fetchEmailTemplateDetail] = useAsync<
    typeof _fetchEmailTemplateDetail
  >({
    asyncFn: _fetchEmailTemplateDetail,
    dependencies: [_fetchEmailTemplateDetail],
  });

  return {
    isLoading,
    emailTemplateDetail,
    fetchEmailTemplateDetail,
  };
};
