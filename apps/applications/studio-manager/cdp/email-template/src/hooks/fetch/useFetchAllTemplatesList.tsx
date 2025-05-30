import { useCallback } from "react";

import {
  fetchAllEmailTemplateSummariesAction,
  selectAllEmailTemplateSummaries,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchAllEmailTemplates = () => {
  const emailTemplateList = useEmailTemplateStore(
    selectAllEmailTemplateSummaries,
  );

  const _fetchAllEmailTemplates = useCallback(async () => {
    return fetchAllEmailTemplateSummariesAction(fetch, {
      is_default_bsport_template: false,
      is_franchise: false,
    });
  }, []);

  const [{ isLoading }, fetchAllEmailTemplates] = useAsync<
    typeof _fetchAllEmailTemplates
  >({
    asyncFn: _fetchAllEmailTemplates,
    dependencies: [_fetchAllEmailTemplates],
  });

  return {
    isLoading,
    emailTemplateList,
    fetchAllEmailTemplates,
  };
};
