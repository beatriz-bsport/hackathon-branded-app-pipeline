// @flow

import { createSelector } from 'reselect';

import type { State } from '../../state/types';
import type { email_template_state } from './types';

export const getAllEmailTemplatesDict = (state: State): email_template_state =>
  state.emailTemplate.byId;

export const getEmailTemplatesDetail = (state: State): email_template_state =>
  state.emailTemplate.detail.byId;

export const getAllEmailTemplatesSummariesDict = (
  state: State,
): email_template_state => state.emailTemplate.byId;

export const getAllEmailTemplatesId = (state: State): email_template_state =>
  state.emailTemplate.allIds;

export const getAllEmailTemplatesSummaries = createSelector(
  [getAllEmailTemplatesSummariesDict, getAllEmailTemplatesId],
  (summaryDict, IdList) => IdList.map((id) => summaryDict[id]),
);

export const getFreshEmailTemplateSummariesIds = createSelector(
  getAllEmailTemplatesSummaries,
  (sl) => sl.map((list) => list.id),
);
