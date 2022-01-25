import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

export const getAllEmailTemplatesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getEmailTemplatesDetail = (state: RootState) =>
  state.emailTemplate.detail.byId;

export const getAllEmailTemplatesSummariesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getAllEmailTemplatesId = (state: RootState) =>
  state.emailTemplate.allIds;

export const getAllEmailTemplatesSummaries = createSelector(
  [getAllEmailTemplatesSummariesDict, getAllEmailTemplatesId],
  (summaryDict, IdList) =>
    IdList.map((id) => summaryDict[id]).filter((s) => !!s),
);

export const getFreshEmailTemplateSummariesIds = createSelector(
  getAllEmailTemplatesSummaries,
  (sl) => sl.map((list) => list.id),
);

export const getFranchisorSavedFilter = (state: RootState) =>
  state.emailTemplate.savedFilter.filters;
