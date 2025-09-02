import { useCallback } from "react";

import {
  fuzzySearchEmailTemplateAction,
  selectFuzzySearchEmailTemplateSummaries,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";

import { fetch } from "#src/utils/fetch";

export type EmailTemplateSearchParams = {
  page?: number;
  page_size?: number;
  id__in?: string;
};

export const useSearchEmailTemplate = () => {
  const emailTemplates = useEmailTemplateStore(
    selectFuzzySearchEmailTemplateSummaries,
  );

  const fetchEmailTemplates = useCallback(
    async (query: string, params?: EmailTemplateSearchParams) => {
      return await fuzzySearchEmailTemplateAction(fetch, {
        queryString: query,
        ...params,
        is_default_bsport_template: false,
        is_franchise: false,
        page_size: 10,
        page: 1,
      });
    },
    [],
  );

  return {
    fetchEmailTemplates,
    emailTemplates,
  };
};
