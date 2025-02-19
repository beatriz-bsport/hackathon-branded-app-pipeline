import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesSummariesLoading,
  getEmailTemplateDetailsLoading,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import {
  emailTemplateComplete,
  emailTemplatesSummaries,
} from '#src/libs/email-editor/actions';

export type FetchTemplateDetailsParams = {
  templateId: number;
};

export const useEmailTemplates = () => {
  const dispatch = useDispatch();

  const templateDetailList = useSelector(getEmailTemplatesDetail);
  const templateSummaryList = useSelector(getAllEmailTemplatesSummaries);
  const loadingTemplateDetails = useSelector(getEmailTemplateDetailsLoading);
  const loadingTemplateSummaries = useSelector(
    getEmailTemplatesSummariesLoading,
  );

  const fetchTemplateDetails = useCallback(
    ({ templateId }: FetchTemplateDetailsParams) => {
      dispatch(emailTemplateComplete(templateId));
    },
    [dispatch],
  );

  const fetchTemplateSummaries = useCallback(() => {
    dispatch(emailTemplatesSummaries());
  }, [dispatch]);

  return {
    templateDetailList,
    templateSummaryList,
    loadingTemplateDetails,
    loadingTemplateSummaries,
    fetchTemplateDetails,
    fetchTemplateSummaries,
  };
};
