import { useEffect } from "react";

import {
  fetchEmailTemplateDetailAction,
  selectEmailTemplateDetail,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchEmailTemplateDetailBinded = fetchEmailTemplateDetailAction.bind(
  null,
  fetch,
);

export const useFetchEmailTemplateDetails = ({
  emailTemplateId,
}: {
  emailTemplateId: number | null;
}) => {
  const [{ isLoading }, fetchEmailTemplateDetail] = useAsync<
    typeof fetchEmailTemplateDetailBinded
  >({
    asyncFn: fetchEmailTemplateDetailBinded,
  });

  const emailTemplateDetail = useEmailTemplateStore((state) => {
    if (!emailTemplateId) return null;
    return selectEmailTemplateDetail(state, emailTemplateId);
  });

  useEffect(() => {
    if (emailTemplateId) {
      fetchEmailTemplateDetail({ id: emailTemplateId });
    }
  }, [emailTemplateId]);

  return {
    isLoading,
    emailTemplateDetail,
    fetchEmailTemplateDetail,
  };
};
